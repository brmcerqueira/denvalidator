import { RuleResult } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";

export function isString(data: any): RuleResult {
    if (data && typeof data !== "string") {
        return new InconsistencyResult(data);
    }
    return null;
}