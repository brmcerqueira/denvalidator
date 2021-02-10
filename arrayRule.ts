import { Schema } from "./schema.ts";
import { ComplexRule } from "./complexRule.ts";
import { required } from "./required.ts";

export type ArrayRuleOptions = {
    required: boolean,
    min?: number,
    max?: number
}

const isRequired = required();

export class ArrayRule extends ComplexRule {
    constructor(private _schema: Schema, options: ArrayRuleOptions) {
        super();
        if (options.required) {
            this.rules.push(isRequired);
        }
    }

    public get schema(): Schema {
        return this._schema;
    }
}