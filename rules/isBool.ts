import { RuleResult } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";

export function isBool(data: any): RuleResult {
    if (data && typeof data !== "boolean") {
        return new InconsistencyResult(data);
    }
    return null;
}