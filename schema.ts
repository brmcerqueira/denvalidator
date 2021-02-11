import { ComplexRule } from "./rules/complexRule.ts";
import { TransformResult } from "./results/transformResult.ts";
import { InconsistencyResult } from "./results/inconsistencyResult.ts";

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

export type RuleResult = TransformResult | InconsistencyResult | null;

export type Rule = (data: any) => RuleResult | Promise<RuleResult>;

export type Schema = {
    [key: string]: Rule | ComplexRule | Rule[];
};