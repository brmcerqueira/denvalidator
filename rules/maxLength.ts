import { RuleResult, Rule } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";

export function maxLength(max: number): Rule {
    return function maxLength(data: any): RuleResult {
        if ((typeof data === "string" || Array.isArray(data)) && data.length > max) {
            return new InconsistencyResult(data, { length: data.length, max: max });
        }
        return null;
    };
}