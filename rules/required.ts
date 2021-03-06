import { RuleResult } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";

export function required(data: any): RuleResult {
    if (data === undefined || data === null) {
        return new InconsistencyResult(data);
    }
    return null;
}