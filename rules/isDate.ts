import { RuleResult } from "../schema.ts";
import { InconsistencyResult } from "../inconsistencyResult.ts";

const regexISODate = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/;

export function isDate(data: any): RuleResult {
    if (!(data instanceof Date)) {      
        if (typeof data == "string" && regexISODate.test(data)) {
            return value => new Date(value);
        } 
        return new InconsistencyResult(data);
    }
    
    return null;
}