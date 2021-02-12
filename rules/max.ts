import { RuleResult, Rule } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";

export function max(value: number): Rule {
    return function max(data: any): RuleResult {
        if (typeof data === "number" && data > value) {
            return new InconsistencyResult(data, { max: value });
        }
        return null;
    };
}