import { RuleResult } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";

export function isString(data: any): RuleResult {
    if (typeof data != "string") {
        return new InconsistencyResult(data);
    }
    return null;
}