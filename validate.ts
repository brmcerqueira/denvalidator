import { InconsistencyResult } from "./inconsistencyResult.ts";
import { Schema, Rule, RuleResult, ISchemaRule, FieldContext } from "./schema.ts";

export type TransformResult = (data: any) => any;

export type InconsistencyMessage = (result: InconsistencyResult) => string;

const messages: {
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

async function treatRule(rule: Rule, context: FieldContext) {
    let result = rule(context.current);

    if (result && isPromiseRuleResult(result)) {
        result = await result;
    }

    if (result) {
        if (result instanceof InconsistencyResult) {
            context.inconsistencies.push(result);
        } else {
            context.current = result(context.current);
        }
    }
}

export async function validate(data: any, schema: Schema) {
    for (const key in data) {
        if (schema[key]) {
            let context = {
                current: data[key],
                inconsistencies: []
            };
            let rules = schema[key];
            if (isSchemaRule(rules)) {
                rules.validate(context.current);
            } 
            else if (isRuleArray(rules)) {
                for (let i = 0; i < rules.length; i++) {
                    await treatRule(rules[i], context);
                }
            } 
            else {
                await treatRule(rules, context);
            }
        }
        else {
            delete data[key];
        }
    }
}