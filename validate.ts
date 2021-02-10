import { Schema, Rule, RuleResult, FieldContext, ValidateResult } from "./schema.ts";
import { InconsistencyResult } from "./inconsistencyResult.ts";
import { globalMessages, Messages, InconsistencyMessage } from "./globalMessages.ts";
import { ObjectRule } from "./objectRule.ts";
import { ArrayRule } from "./arrayRule.ts";
import { ComplexRule } from "./complexRule.ts";

export type TransformResult = (data: any) => any;

const validateMessages: {
    [key: string]: InconsistencyMessage
} = {};

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

async function treatRule(field: string, rule: Rule, context: FieldContext) {
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

export async function validateObject(data: any, schema: Schema, result: ValidateResult) {
    for (const key in data) {
        if (schema[key]) {
            let context: FieldContext = {
                current: data[key]
            };
            let rules = schema[key];
            if (rules instanceof ComplexRule) {
                await treatRuleArray(key, rules.rules, context);
                if (rules instanceof ObjectRule) {
          
                } 
                else if (rules instanceof ArrayRule) {
                    
                } 
            } 
            else if (isRuleArray(rules)) {
                await treatRuleArray(key, rules, context);
            } 
            else {
                await treatRule(key, rules, context);
            }

            if (context.inconsistencies) {
                result.valid = false;
                result.errors = result.errors || {};
                result.errors[key] = context.inconsistencies;
            }

            data[key] = context.current;
        }
        else {
            delete data[key];
        }
    }
}

async function treatRuleArray(field: string, rules: Rule[], context: FieldContext) {
    for (let i = 0; i < rules.length; i++) {
        await treatRule(field, rules[i], context);
    }
}
/*
export async function validate2(data: any, schema: Schema): Promise<ValidateResult> {
    let result: ValidateResult = {
        valid: true
    };
    for (const key in data) {
        if (schema[key]) {
            let context: FieldContext = {
                current: data[key]
            };
            let rules = schema[key];
            if (isSchemaRule(rules)) {
                rules.validate(context.current);
            } 
            else if (isRuleArray(rules)) {
                for (let i = 0; i < rules.length; i++) {
                    await treatRule(key, rules[i], context);
                }
            } 
            else {
                await treatRule(key, rules, context);
            }

            if (context.inconsistencies) {
                result.valid = false;
                result.errors = result.errors || {};
                result.errors[key] = context.inconsistencies;
            }

            data[key] = context.current;
        }
        else {
            delete data[key];
        }
    }
    return result;
}*/