import { ValidateResult, ErrorsValidateResult } from "./schema.ts";
import { ValidateResultWrapper } from "./validateResultWrapper.ts";

export class RootValidateResultWrapper extends ValidateResultWrapper {

    private _result: ValidateResult = {
        valid: true
    };

    constructor() {
        super(() => {
            if (this._result.valid) {
                this._result.valid = false;
                this._result.errors = {};
            }
            return <ErrorsValidateResult>this._result.errors;
        });
    }


    public get result(): ValidateResult {
        return this._result;
    }
}
