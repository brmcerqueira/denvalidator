import { Schema } from "./schema.ts";
import { required } from "./required.ts";
import { ComplexRule } from "./complexRule.ts";

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