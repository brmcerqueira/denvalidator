export class TransformResult {
    constructor(private _value: any) {       
    }

    public get value(): any {
        return this._value;
    }
}