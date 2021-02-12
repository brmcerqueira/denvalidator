import { RuleResult, Rule } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";

export function into(...values: any[]): Rule {
    return function into(data: any): RuleResult {
        if (data && values.indexOf(data) == -1) {
            return new InconsistencyResult(data, { values: values });  
        }
   
        return null;
    }
}