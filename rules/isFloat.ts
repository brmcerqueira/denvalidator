import { RuleResult } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";
import { TransformResult } from "../results/transformResult.ts";

function isFloatPrivate(data: any): boolean {
    return Number(data) === data && data % 1 !== 0;
}

export function isFloat(data: any): RuleResult {
    if (data && !isFloatPrivate(data)) {
        if (typeof data == "string") {
            let value = Number.parseFloat(data);
            if (!Number.isNaN(value)) {
                return new TransformResult(value);
            }         
        } 
        return new InconsistencyResult(data);
    }
    return null;
}