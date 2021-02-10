import { InconsistencyResult } from "./inconsistencyResult.ts";
import { ObjectRule } from "./objectRule.ts";
import { ArrayRule } from "./arrayRule.ts";

export type FieldContext = { 
    current: any, 
    inconsistencies?: Inconsistencies
};

export type Inconsistencies = {
    [key: string]: string;
};

export type SchemaInconsistencies = {
    [key: string]: string;
    $nested: any | any[];
};

export type ValidateResult = { 
    valid: boolean,
    errors?: {
        [key: string]: Inconsistencies | SchemaInconsistencies
    }
};

export type TransformResult = (data: any) => any;

export type RuleResult = TransformResult | InconsistencyResult | null;

export type Rule = (data: any) => RuleResult | Promise<RuleResult>;

export type Schema = {
    [key: string]: Rule[] | Rule | ObjectRule | ArrayRule;
};