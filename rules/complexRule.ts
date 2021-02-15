import { Rule, Rules } from "../schema.ts";

export abstract class ComplexRule {
    private _rules: Rule[];

    constructor(rules: Rules) {
        this._rules = Array.isArray(rules) ? rules : [rules];
    }

    public get rules(): Rule[] {
        return this._rules;
    }
}