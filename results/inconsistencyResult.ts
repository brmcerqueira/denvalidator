export type InconsistencyResultArgs = {
    [key: string]: any
};

export class InconsistencyResult {
    constructor(private _current: any, private _args?: InconsistencyResultArgs) {
        this._args = this._args || {};
    }

    public get current(): any {
        return this._current;
    }

    public get args(): InconsistencyResultArgs {
        return <InconsistencyResultArgs> this._args;
    }
}
