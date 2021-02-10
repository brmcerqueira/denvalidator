import { Schema, Rule, RuleResult, ISchemaRule, FieldContext, ValidateResult } from "./schema.ts";
import { InconsistencyResult } from "./inconsistencyResult.ts";
import { globalMessages, Messages, InconsistencyMessage } from "./globalMessages.ts";

export type TransformResult = (data: any) => any;

const validateMessages: {
    [key: string]: InconsistencyMessage
} = {};

function isSchemaRule(data: any): data is ISchemaRule {
    return data && data.validate;
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

export async function validate(data: any, schema: Schema): Promise<ValidateResult> {
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
        }
        else {
            delete data[key];
        }
    }
    return result;
}