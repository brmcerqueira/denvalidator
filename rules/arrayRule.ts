import { Rules, DynamicRulesResult } from "../schema.ts";
import { ComplexRule } from "./complexRule.ts";
import { DynamicRules } from "./dynamicRules.ts";
import { required } from "./required.ts";

export type ArrayRuleEach = DynamicRules | DynamicRulesResult;

export function array(each: ArrayRuleEach): ArrayRule
export function array(rules: Rules, each: ArrayRuleEach): ArrayRule
export function array(arg1: ArrayRuleEach, arg2?: ArrayRuleEach): ArrayRule {
    return new ArrayRule(arg2 || arg1, arg2 ? <Rules> arg1 : required);
}

export class ArrayRule extends ComplexRule {
    constructor(private _each: ArrayRuleEach, rules: Rules) {
        super(rules);
    }

    public get each(): ArrayRuleEach {
        return this._each;
    }
}