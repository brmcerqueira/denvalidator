import { InconsistencyResult } from "./inconsistencyResult.ts";

export type InconsistencyMessage = (result: InconsistencyResult) => string;

export type Messages = {
    [key: string]: string
};

export const validateMessages: {
    [key: string]: InconsistencyMessage
} = {};

export const globalMessages: Messages = {
    required: "The field '#{value}' is required."
};

const regexVariable = /#{(?<variable>[\w\\.]*)}/;

export function compile(message: string): InconsistencyMessage {
    let text = "";

    message.split(regexVariable).forEach(item => {
        if (item !== "") {
            if (text.length > 0) {
              text += " + ";
            }
            text += item.startsWith("#{") && item.endsWith("}") ? item.slice(2, item.length - 1) : `'${item}'`;
        }
    });

    return eval(`function (result) { 
        let value = result.current; 
        let constraints = result.constraints; 
        return '${text}'; 
    }`);
}

export function addMessages(messages: Messages) {
    for (const key in messages) {
        validateMessages[key] = compile(messages[key]);
    }
}