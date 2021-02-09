export type TransformResult = (data: any) => any;

export type Constraints = {
    [key: string]: any
};

export class InconsistencyResult {   
    constructor(private _actual: any, private _constraints: Constraints) {     
    }

    public get actual(): any {
        return this._actual;
    }

    public get constraints(): Constraints {
        return this._constraints;
    }
};

export type RuleResult = TransformResult | InconsistencyResult | null;

export type Rule = (data: any) => RuleResult | Promise<RuleResult>;

export type Schema = {
    [key: string]: Rule[] | Rule
}

export async function validate(data: any, schema: Schema) {
    
}