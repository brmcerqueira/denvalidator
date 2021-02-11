import { Schema, Rule } from "../schema.ts";
import { ComplexRule } from "./complexRule.ts";
import { required } from "./required.ts";
import { minLength } from "./minLength.ts";
import { maxLength } from "./maxLength.ts";

export type ArrayRuleOptions = {
    required: boolean,
    min?: number,
    max?: number
}

export type ArrayRuleEach = Rule | Schema | Rule[];

export function array(each: ArrayRuleEach): ArrayRule
export function array(options: ArrayRuleOptions, each: ArrayRuleEach): ArrayRule
export function array(arg1: ArrayRuleOptions | ArrayRuleEach, arg2?: ArrayRuleEach): ArrayRule {
    return new ArrayRule(arg2 || <ArrayRuleEach> arg1, arg2 ? <ArrayRuleOptions> arg1 : { required: true });
}

export class ArrayRule extends ComplexRule {
    constructor(private _each: ArrayRuleEach, options: ArrayRuleOptions) {
        super();

        if (options.required) {
            this.rules.push(required);
        }

        if (options.min) {
            this.rules.push(minLength(options.min));
        }

        if (options.max) {
            this.rules.push(maxLength(options.max));
        }
    }

    public get each(): ArrayRuleEach {
        return this._each;
    }
}