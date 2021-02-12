import { RuleResult } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";
import { TransformResult } from "../results/transformResult.ts";

export function isInt(data: any): RuleResult {
    if (data && !Number.isInteger(data)) {
        if (typeof data === "string") {
            let value = Number.parseInt(data);
            if (!Number.isNaN(value)) {
                return new TransformResult(value);
            }         
        } 
        return new InconsistencyResult(data);
    }
    return null;
}