import { Inconsistencies, ErrorsValidateResult } from "./schema.ts";

export class ValidateResultWrapper {
    constructor(private errors: () => ErrorsValidateResult) {
    }


    public put(field: string, inconsistencies: Inconsistencies): void {
        this.errors()[field] = inconsistencies;
    }


    public go(field: string): ValidateResultWrapper {
        return new ValidateResultWrapper(() => {
            let errors = this.errors();
            errors[field] = {
                $nested: {}
            };
            return <ErrorsValidateResult>errors[field].$nested;
        });
    }
}
