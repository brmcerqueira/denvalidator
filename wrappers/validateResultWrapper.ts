import { ErrorsValidateResult, ComplexInconsistencies, Field } from "../schema.ts";

export class ValidateResultWrapper {
    constructor(private errors: () => ErrorsValidateResult) {
    }

    public put(field: Field, inconsistencies: ComplexInconsistencies): void {
        this.errors()[field.toString()] = inconsistencies;
    }

    public go(field: Field): ValidateResultWrapper {
        return new ValidateResultWrapper(() => {     
            let inconsistencies: ComplexInconsistencies = {
                $nested: {}
            };

            this.put(field, inconsistencies);

            return <ErrorsValidateResult>inconsistencies.$nested;
        });
    }
}
