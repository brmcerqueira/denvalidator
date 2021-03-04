import { DynamicRulesResult, ComplexRules } from "../schema.ts";
import { isRuleArray,isRule } from "../utils.ts";
import { ArrayRule } from "./arrayRule.ts";
import { ObjectRule } from "./objectRule.ts";

export function choose<T>(treat: (data: T) => DynamicRulesResult | null): DynamicRule {
    return new DynamicRule(treat);
}

export function when<T>(check: (data: T) => boolean, rules: DynamicRulesResult, rulesElse?: DynamicRulesResult): DynamicRule {
    return new DynamicRule(d => check(d) ? rules : (rulesElse || null));
}

export class DynamicRule {
    constructor(private treat: (data: any) => DynamicRulesResult | null) {
    }

    public rules(data: any): ComplexRules | null {
        const rules = this.treat(data);

        if (rules === null || isRuleArray(rules) || isRule(rules) || rules instanceof ArrayRule) {
            return rules;
        }
        else {
            return new ObjectRule(rules, []);
        }
    }
}