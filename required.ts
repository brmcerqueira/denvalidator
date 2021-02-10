import { Rule, RuleResult } from "./schema.ts";
import { InconsistencyResult } from "./inconsistencyResult.ts";

export function required(): Rule {
    return (data: any): RuleResult => {
        if (data == undefined || data == null) {
            return new InconsistencyResult(data);
        }
        return null;
    }
}