import { InconsistencyResult } from "./inconsistencyResult.ts";

export type InconsistencyMessage = (field: string, result: InconsistencyResult) => string;

export type Messages = {
    [key: string]: string | InconsistencyMessage
};

export const globalMessages: Messages = {
    required: "The field '#{field}' is required."
};