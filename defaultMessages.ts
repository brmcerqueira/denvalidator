import { registerMessages } from "./messages.ts";

registerMessages({
    $default: "The field '#{field}' with the value '#{value}' has an error.",
    required: "The field '#{field}' is required.",
    isString: "The field '#{field}' with the value '#{value}' must be string.",
    isDate: "The field '#{field}' with the value '#{value}' must be date.",
    isEnum: "The field '#{field}' with the value '#{value}' must be between [ #{args.values.join(' | ')} ].",
    minLength: "The field '#{field}' must have a minimum length of #{args.min}, Current is #{args.length}.",
    maxLength: "The field '#{field}' must have a maximum length of #{args.max}, Current is #{args.length}."
});