export type Constraints = {
    [key: string]: any
};

export class InconsistencyResult {
    constructor(private _current: any, private _constraints: Constraints) {
    }


    public get current(): any {
        return this._current;
    }


    public get constraints(): Constraints {
        return this._constraints;
    }
}
