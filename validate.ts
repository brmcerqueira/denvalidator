import { Schema, Rule, RuleResult, FieldContext, ValidateResult } from "./schema.ts";
import { InconsistencyResult } from "./inconsistencyResult.ts";
import { globalMessages, Messages, InconsistencyMessage, Field } from "./globalMessages.ts";
import { ObjectRule } from "./objectRule.ts";
import { ArrayRule } from "./arrayRule.ts";
import { ComplexRule } from "./complexRule.ts";
import { ValidateResultWrapper } from "./validateResultWrapper.ts";
import { RootValidateResultWrapper } from "./rootValidateResultWrapper.ts";

export type TransformResult = (data: any) => any;

const validateMessages: {
    [key: string]: InconsistencyMessage
} = {};

function isRule(data: any): data is Rule {
    return data && data.apply && data.call;
}

function isRuleArray(data: any): data is Rule[] {
    return data && data.length && data.length > 0;
}

function isPromiseRuleResult(data: any): data is Promise<RuleResult> {
    return data && data.then;
}

function compileInconsistencyMessage(message: string): InconsistencyMessage {
    let text = "";

    message.split(/#{(?<variable>[\w\\.]*)}/).forEach(item => {
        if (item !== "") {
            if (text.length > 0) {
              text += " + ";
            }
            text += item.startsWith("#{") && item.endsWith("}") ? item.slice(2, item.length - 1) : `'${item}'`;
        }
    });

    return eval(`function (field, result) { 
        let value = result.current; 
        let constraints = result.constraints; 
        return '${text}'; 
    }`);
}

export function registerMessages(messages: Messages) {
    for (const key in messages) {
        validateMessages[key] = typeof messages[key] === "string" 
        ? compileInconsistencyMessage(<string>messages[key]) 
        : <InconsistencyMessage>messages[key];
    }
}

registerMessages(globalMessages);

async function treatRule(field: Field, rule: Rule, context: FieldContext) {
    let result = rule(context.current);
    if (result && isPromiseRuleResult(result)) {
        result = await result;
    }

    if (result) {
        if (result instanceof InconsistencyResult) {
            context.inconsistencies = context.inconsistencies || {};
            context.inconsistencies[rule.name] = validateMessages[rule.name](field, result);
        } else {
            context.current = result(context.current);
        }
    }
}

async function validateObject(data: any, schema: Schema, wrapper: ValidateResultWrapper) {
    for (const field in data) {
        if (schema[field]) {
            let context: FieldContext = {
                current: data[field]
            };
            let item = schema[field];
            if (item instanceof ComplexRule) {
                await treatRuleArray(field, item.rules, context);
                if (item instanceof ObjectRule) {
                    await validateObject(context.current, item.schema, wrapper.go(field));
                } 
                else if (item instanceof ArrayRule) {
                    let fieldWrapper = wrapper.go(field);
                    let array: any[] = context.current;

                    let treat: (index: Field, elementContext: FieldContext) => void;
         
                    if (isRuleArray(item.each)) {
                        let each = item.each;
                        treat = async function (index: Field, itemContext: FieldContext) {
                            await treatRuleArray(index, each, itemContext);
                        }
                    } 
                    else if (isRule(item.each)) {
                        let each = item.each;
                        treat = async function (index: Field, itemContext: FieldContext) {
                            await treatRule(index, each, itemContext);
                        }
                    } 
                    else {
                        let each = item.each;
                        treat = async function (index: Field, itemContext: FieldContext) {
                            await validateObject(itemContext.current, each, fieldWrapper.go(index));
                        }                
                    } 

                    for (let i = 0; i < array.length; i++) {
                        let itemContext: FieldContext = {
                            current: array[i]
                        };

                        await treat(i, itemContext);

                        if (itemContext.inconsistencies) {
                            fieldWrapper.put(i, itemContext.inconsistencies);
                        }
                    }                                   
                } 
            } 
            else if (isRuleArray(item)) {
                await treatRuleArray(field, item, context);
            } 
            else {
                await treatRule(field, item, context);
            }

            if (context.inconsistencies) {
                wrapper.put(field, context.inconsistencies);
            }

            data[field] = context.current;
        }
        else {
            delete data[field];
        }
    }
}

async function treatRuleArray(field: Field, rules: Rule[], context: FieldContext) {
    for (let i = 0; i < rules.length; i++) {
        await treatRule(field, rules[i], context);
    }
}

export async function validate(data: any, schema: Schema): Promise<ValidateResult> {
    let root = new RootValidateResultWrapper();
    await validateObject(data, schema, root);
    return root.result;
}