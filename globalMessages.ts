import { InconsistencyResult } from "./inconsistencyResult.ts";

export type Field = string | number;

export type InconsistencyMessage = (field: Field, result: InconsistencyResult) => string;

export type Messages = {
    [key: string]: string | InconsistencyMessage
};

export const globalMessages: Messages = {
    required: "The field '#{field}' is required."
};