import { Rule } from "./schema.ts";

export function isRule(data: any): data is Rule {
    return data && data.apply && data.call;
}

export function isRuleArray(data: any): data is Rule[] {
    return data && Array.isArray(data);
}