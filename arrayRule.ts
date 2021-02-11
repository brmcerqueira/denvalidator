import { Schema, Rule } from "./schema.ts";
import { ComplexRule } from "./complexRule.ts";
import { required } from "./required.ts";

export type ArrayRuleOptions = {
    required: boolean,
    min?: number,
    max?: number
}

export class ArrayRule extends ComplexRule {
    constructor(private _each: Rule | Schema | Rule[], options: ArrayRuleOptions) {
        super();
        if (options.required) {
            this.rules.push(required);
        }
    }

    public get each(): Rule | Schema | Rule[] {
        return this._each;
    }
}