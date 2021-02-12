import { RuleResult, Rule } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";

export function minLength(min: number): Rule {
    return function minLength(data: any): RuleResult {
        if ((typeof data === "string" || Array.isArray(data)) && data.length < min) {
            return new InconsistencyResult(data, { length: data.length, min: min });
        }
        return null;
    };
}