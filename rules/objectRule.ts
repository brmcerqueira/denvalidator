import { Schema } from "../schema.ts";
import { required } from "./required.ts";
import { ComplexRule } from "./complexRule.ts";

export function object(schema: Schema): ObjectRule
export function object(required: boolean, schema: Schema): ObjectRule
export function object(arg1: boolean | Schema, arg2?: Schema): ObjectRule {
    return new ObjectRule(arg2 || <Schema> arg1, arg2 ? <boolean> arg1 : true);
}

export class ObjectRule extends ComplexRule {
    constructor(private _schema: Schema, isRequired: boolean) {
        super();
        
        if (isRequired) {
            this.rules.push(required);
        }
    }

    public get schema(): Schema {
        return this._schema;
    }
}