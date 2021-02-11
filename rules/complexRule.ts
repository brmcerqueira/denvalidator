import { Rule } from "../schema.ts";

export abstract class ComplexRule {
    private _rules: Rule[] = [];

    public get rules(): Rule[] {
        return this._rules;
    }
}