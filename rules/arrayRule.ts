import { Schema, Rule, Rules } from "../schema.ts";
import { ComplexRule } from "./complexRule.ts";
import { required } from "./required.ts";

export type ArrayRuleEach = Rules | Schema;

export function array(each: ArrayRuleEach): ArrayRule
export function array(rules: Rules, each: ArrayRuleEach): ArrayRule
export function array(arg1: ArrayRuleEach, arg2?: ArrayRuleEach): ArrayRule {
    return new ArrayRule(arg2 || arg1, arg2 ? <Rules> arg1 : required);
}

export class ArrayRule extends ComplexRule {
    constructor(private _each: ArrayRuleEach, rules: Rule | Rule[]) {
        super(rules);
    }

    public get each(): ArrayRuleEach {
        return this._each;
    }
}