import { RuleResult } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";

export function nullable(data: any): RuleResult {
    if (data === undefined) {
        return new InconsistencyResult(data);
    }
    return null;
}