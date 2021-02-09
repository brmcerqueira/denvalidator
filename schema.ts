import { InconsistencyResult } from "./inconsistencyResult.ts";

export type FieldContext = { 
    current: any, 
    inconsistencies: InconsistencyResult[] 
};

export type TransformResult = (data: any) => any;

export type RuleResult = TransformResult | InconsistencyResult | null;

export type Rule = (data: any) => RuleResult | Promise<RuleResult>;

export type Schema = {
    [key: string]: Rule[] | Rule | ISchemaRule;
};

export interface ISchemaRule {
    validate(context: FieldContext): void
}

