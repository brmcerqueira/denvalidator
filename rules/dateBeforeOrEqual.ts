import { RuleResult, Rule } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";

export function dateBeforeOrEqual(value: Date): Rule {
    return function dateBeforeOrEqual(data: any): RuleResult {
        if (data && data instanceof Date && data > value) {
            return new InconsistencyResult(data, { before: value });
        }
        return null;
    };
}