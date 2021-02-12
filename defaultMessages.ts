import { registerMessages } from "./messages.ts";

registerMessages({
    $default: "The field '#{field}' with the value '#{value}' has an error.",
    dateAfterOrEqual: "The field '#{field}' must be after or equal of '#{args.after}', Current is '#{value}'.",
    dateBeforeOrEqual: "The field '#{field}' must be before or equal of '#{args.before}', Current is '#{value}'.",
    into: "The field '#{field}' with the value '#{value}' must be between [ #{args.values.join(' | ')} ].",
    isBool: "The field '#{field}' with the value '#{value}' must be boolean.",
    isDate: "The field '#{field}' with the value '#{value}' must be date.",
    isEmail: "The field '#{field}' with the value '#{value}' must be e-mail.",
    isEnum: "The field '#{field}' with the value '#{value}' must be between [ #{args.values.join(' | ')} ].",
    isFloat: "The field '#{field}' with the value '#{value}' must be float.",
    isInt: "The field '#{field}' with the value '#{value}' must be integer.",
    isIPv4: "The field '#{field}' with the value '#{value}' must be IPv4.",
    isString: "The field '#{field}' with the value '#{value}' must be string.",
    match: "The field '#{field}' with the value '#{value}' not match '#{args.regex}'.",
    max: "The field '#{field}' must have a maximum of #{args.max}, Current is #{value}.",
    maxLength: "The field '#{field}' must have a maximum length of #{args.max}, Current is #{args.length}.",
    min: "The field '#{field}' must have a minimum of #{args.min}, Current is #{value}.",
    minLength: "The field '#{field}' must have a minimum length of #{args.min}, Current is #{args.length}.",
    nullable: "The field '#{field}' is not defined.",
    required: "The field '#{field}' is required."
});