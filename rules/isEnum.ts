import { RuleResult, Rule } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";
import { TransformResult } from "../results/transformResult.ts";

export function isEnum(enumType: any): Rule {
    let values = Object.values(enumType);
    return function isEnum(data: any): RuleResult {
        if (values.indexOf(data) == -1) {
            return new InconsistencyResult(data, { values: values });
        }

        if (typeof data == "string") {
            return new TransformResult(enumType[data]);
        }

        return null;
    }
}