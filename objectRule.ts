import { ISchemaRule, Schema, FieldContext } from "./schema.ts";

export class ObjectRule implements ISchemaRule {
    constructor(private required: boolean, private schema: Schema) {
    }

    public validate(context: FieldContext): void {
    }
}
