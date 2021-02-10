import { ErrorsValidateResult, ComplexInconsistencies } from "./schema.ts";
import { Field } from "./globalMessages.ts";

export class ValidateResultWrapper {
    constructor(private errors: () => ErrorsValidateResult) {
    }

    private isArray(data: any): data is ComplexInconsistencies[] {
        return data && data.length;
    }

    public put(field: Field, inconsistencies: ComplexInconsistencies): void {
        let errorsValidateResult = this.errors();
        if (this.isArray(errorsValidateResult)) {
            errorsValidateResult[<number>field] = inconsistencies
        }
        else {
            errorsValidateResult[field] = inconsistencies
        }
    }

    public go(field: Field, isArray?: boolean): ValidateResultWrapper {
        return new ValidateResultWrapper(() => {
            
            let inconsistencies: ComplexInconsistencies = {
                $nested: isArray ? [] : {}
            };
            this.put(field, inconsistencies);

            return <ErrorsValidateResult>inconsistencies.$nested;
        });
    }
}
