import { RuleResult, Rule } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";

export function dateAfterOrEqual(value: Date): Rule {
    return function dateAfterOrEqual(data: any): RuleResult {
        if (data && data instanceof Date && data < value) {
            return new InconsistencyResult(data, { after: value });
        }
        return null;
    };
}