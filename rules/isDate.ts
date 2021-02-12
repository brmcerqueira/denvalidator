import { RuleResult } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";
import { TransformResult } from "../results/transformResult.ts";

const regexISODate = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

export function isDate(data: any): RuleResult {
    if (data && !(data instanceof Date)) {      
        if (typeof data === "string" && regexISODate.test(data)) {
            return new TransformResult(new Date(data));
        } 
        return new InconsistencyResult(data);
    }
    
    return null;
}