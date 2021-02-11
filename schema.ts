import { InconsistencyResult } from "./inconsistencyResult.ts";
import { ComplexRule } from "./rules/complexRule.ts";

export type Field = string | number;

export type FieldContext = { 
    current: any, 
    inconsistencies?: Inconsistencies
};

export type Inconsistencies = {
    [key: string]: string;
};

export type ComplexInconsistencies = {
    $nested?: ErrorsValidateResult;
} | Inconsistencies;

export type ErrorsValidateResult = {
    [key: string]: ComplexInconsistencies
};

export type ValidateResult = { 
    valid: boolean,
    errors?: ErrorsValidateResult
};

export type TransformResult = (data: any) => any;

export type RuleResult = TransformResult | InconsistencyResult | null;

export type Rule = (data: any) => RuleResult | Promise<RuleResult>;

export type Schema = {
    [key: string]: Rule | ComplexRule | Rule[];
};