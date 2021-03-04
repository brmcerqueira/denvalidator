import { InconsistencyResult } from "../results/inconsistencyResult.ts";
import { RuleResult, DynamicRulesResult, ComplexRules } from "../schema.ts";
import { isRuleArray,isRule } from "../utils.ts";
import { ArrayRule } from "./arrayRule.ts";
import { ObjectRule } from "./objectRule.ts";

function rulesNotFound(data: any): RuleResult {
    return new InconsistencyResult(data);
}

export function choose<T>(treat: (data: T) => DynamicRulesResult | null): DynamicRule {
    return new DynamicRule(treat);
}

export function when<T>(check: (data: T) => boolean, rules: DynamicRulesResult, rulesElse: DynamicRulesResult): DynamicRule {
    return new DynamicRule(d => check(d) ? rules : rulesElse);
}

export class DynamicRule {
    constructor(private treat: (data: any) => DynamicRulesResult | null) {
    }

    public rules(data: any): ComplexRules {
        const rules = this.treat(data);

        if (rules === null) {
            return [rulesNotFound];
        }
        else if (isRuleArray(rules) || isRule(rules) || rules instanceof ArrayRule) {
            return rules;
        }
        else {
            return new ObjectRule(rules, []);
        }
    }
}