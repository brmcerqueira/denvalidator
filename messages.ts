import { InconsistencyResult } from "./inconsistencyResult.ts";
import { Field } from "./schema.ts";

export type InconsistencyMessage = (field: Field, result: InconsistencyResult) => string;

export type Messages = {
    [key: string]: string | InconsistencyMessage
};

const globalMessages: Messages = {
    required: "The field '#{field}' is required.",
    isString: "The field '#{field}' with the value '#{value}' must be string."
};

export const compiledMessages: {
    [key: string]: InconsistencyMessage
} = {};

function compile(key: string, message: string) {
    let text = "";

    message.split(/(?<variable>#{[\w\\.]*})/).forEach(item => {
        if (item !== "") {
            if (text.length > 0) {
            text += " + ";
            }
            text += item.startsWith("#{") && item.endsWith("}") 
            ? item.slice(2, item.length - 1) 
            : `"${item.replace("\\","\\\\").replace('"','\\"').replace("'","\\'")}"`;
        }
    });

    eval(`registerCompiledMessage(key, message, function(field, result) { 
        let value = result.current; 
        let constraints = result.constraints; 
        return ${text};
    });`)
}

function registerCompiledMessage(key: string, message: string, compiled: InconsistencyMessage) {
    compiledMessages[key] = (field: Field, result: InconsistencyResult): string => {      
       try {
            return compiled(field, result);
       } catch {
            throw new Error(`Can't build message '${key}' => ${message}`);      
       } 
    };
}

export function registerMessages(messages: Messages) {
    for (const key in messages) {
        if (typeof messages[key] === "string" ) {
            compile(key, <string>messages[key]);
        } else {
            compiledMessages[key] = <InconsistencyMessage>messages[key];
        }      
    }
}

registerMessages(globalMessages);