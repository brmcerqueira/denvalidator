import { RuleResult, Rule } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";

export function min(value: number): Rule {
    return function min(data: any): RuleResult {
        if (typeof data === "number" && data < value) {
            return new InconsistencyResult(data, { min: value });
        }
        return null;
    };
}