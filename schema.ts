import { ComplexRule } from "./rules/complexRule.ts";
import { TransformResult } from "./results/transformResult.ts";
import { InconsistencyResult } from "./results/inconsistencyResult.ts";
import { DynamicRules } from "./rules/dynamicRules.ts";
import { ArrayRule } from "./rules/arrayRule.ts";

export type Rules = Rule | Rule[];

export type ComplexRules = ComplexRule | Rules;

export type DynamicRulesResult = ArrayRule | Rules | Schema

export type AllRules = DynamicRules | ComplexRules;

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
    [key: string]: AllRules;
};