import { Schema, Rule, RuleResult, FieldContext, ValidateResult, Field } from "./schema.ts";
import { InconsistencyResult } from "./inconsistencyResult.ts";
import { ObjectRule } from "./rules/objectRule.ts";
import { ArrayRule } from "./rules/arrayRule.ts";
import { ComplexRule } from "./rules/complexRule.ts";
import { ValidateResultWrapper } from "./wrappers/validateResultWrapper.ts";
import { RootValidateResultWrapper } from "./wrappers/rootValidateResultWrapper.ts";
import { compiledMessages } from "./messages.ts";

function isRule(data: any): data is Rule {
    return data && data.apply && data.call;
}

function isRuleArray(data: any): data is Rule[] {
    return data && Array.isArray(data);
}

function isPromiseRuleResult(data: any): data is Promise<RuleResult> {
    return data && data.then;
}

async function treatRule(field: Field, rule: Rule, context: FieldContext) {
    let result = rule(context.current);
    if (result && isPromiseRuleResult(result)) {
        result = await result;
    }

    if (result) {
        if (result instanceof InconsistencyResult) {
            context.inconsistencies = context.inconsistencies || {};
            context.inconsistencies[rule.name] = compiledMessages[rule.name](field, result);
        } else {
            context.current = result(context.current);
        }
    }
}

async function validateObject(data: any, schema: Schema, wrapper: ValidateResultWrapper) {
    for (const field in schema) {
        let context: FieldContext = {
            current: data ? data[field] : undefined
        };
        let item = schema[field];
        if (item instanceof ComplexRule) {
            await treatRuleArray(field, item.rules, context);
            if (context.current) {
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

        if (data) {
            data[field] = context.current;
        }     
    }

    if (data) {
        for (const field in data) {
            if (!schema[field]) {
                delete data[field];
            }
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