export type Constraints = {
    [key: string]: any
};

export class InconsistencyResult {
    constructor(private _current: any, private _constraints?: Constraints) {
        this._constraints = this._constraints || {};
    }

    public get current(): any {
        return this._current;
    }


    public get constraints(): Constraints {
        return <Constraints> this._constraints;
    }
}
