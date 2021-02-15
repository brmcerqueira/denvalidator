import { Schema, Rules } from "../schema.ts";
import { required } from "./required.ts";
import { ComplexRule } from "./complexRule.ts";

export function object(schema: Schema): ObjectRule
export function object(rules: Rules, schema: Schema): ObjectRule
export function object(arg1: Rules | Schema, arg2?: Schema): ObjectRule {
    return new ObjectRule(arg2 || <Schema> arg1, arg2 ? <Rules> arg1 : required);
}

export class ObjectRule extends ComplexRule {
    constructor(private _schema: Schema, rules: Rules) {
        super(rules);
    }

    public get schema(): Schema {
        return this._schema;
    }
}