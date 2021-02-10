import { Schema } from "./schema.ts";
import { required } from "./required.ts";
import { ComplexRule } from "./complexRule.ts";

const isRequired = required();

export class ObjectRule extends ComplexRule {
    constructor(private _schema: Schema, required: boolean) {
        super();
        if (required) {
            this.rules.push(isRequired);
        }
    }

    public get schema(): Schema {
        return this._schema;
    }
}