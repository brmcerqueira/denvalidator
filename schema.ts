import { InconsistencyResult } from "./inconsistencyResult.ts";

export type FieldContext = { 
    current: any, 
    inconsistencies?: Inconsistencies
};

export type Inconsistencies = {
    [key: string]: string;
};

export type ValidateResult = { 
    valid: boolean,
    errors?: {
        [key: string]: Inconsistencies
    }
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

