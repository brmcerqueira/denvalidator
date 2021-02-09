import { InconsistencyResult } from "./inconsistencyResult.ts";

export type TransformResult = (data: any) => any;

export type InconsistencyMessage = (result: InconsistencyResult) => string;

export type RuleResult = TransformResult | InconsistencyResult | null;

export type Rule = (data: any) => RuleResult | Promise<RuleResult>;

export type Schema = {
    [key: string]: Rule[] | Rule
}

const messages: {
    [key: string]: InconsistencyMessage
} = {};

function isArray(data: any): data is Rule[] {
    return data && data.length && data.length > 0;
}

function isPromise(data: any): data is Promise<RuleResult> {
    return data && data.then;
}

async function treatRuleResult(rule: Rule, context: { current: any, inconsistencies: InconsistencyResult[] }) {
    let result = rule(context.current);
    
    if (result && isPromise(result)) {
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
            if (isArray(rules)) {
                for (let i = 0; i < rules.length; i++) {
                    await treatRuleResult(rules[i], context);
                }
            } else {
                await treatRuleResult(rules, context);
            }
        }
        else {
            delete data[key];
        }
    }
}