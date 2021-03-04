import { InconsistencyResult } from "../results/inconsistencyResult.ts";
import { RuleResult, DynamicRulesResult, ComplexRules } from "../schema.ts";
import { isRuleArray,isRule } from "../utils.ts";
import { ArrayRule } from "./arrayRule.ts";
import { ObjectRule } from "./objectRule.ts";

function rulesNotFound(data: any): RuleResult {
    return new InconsistencyResult(data);
}

export function choose<T>(treat: (parent: T) => DynamicRulesResult | null): DynamicRules {
    return new DynamicRules(treat);
}

export function when<T>(check: (parent: T) => boolean, rules: DynamicRulesResult): DynamicRules {
    return new DynamicRules(p => check(p) ? rules : null);
}

export class DynamicRules {
    constructor(private treat: (parent: any) => DynamicRulesResult | null) {
    }

    public rules(parent: any): ComplexRules {
        const rules = this.treat(parent);

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