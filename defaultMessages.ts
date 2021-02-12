import { registerMessages } from "./messages.ts";

registerMessages({
    $default: "The field '#{field}' with the value '#{value}' has an error.",
    required: "The field '#{field}' is required.",
    isString: "The field '#{field}' with the value '#{value}' must be string.",
    isDate: "The field '#{field}' with the value '#{value}' must be date.",
    isEnum: "The field '#{field}' with the value '#{value}' must be between [ #{args.values.join(' | ')} ].",
    minLength: "The field '#{field}' must have a minimum length of #{args.min}, Current is #{args.length}.",
    maxLength: "The field '#{field}' must have a maximum length of #{args.max}, Current is #{args.length}.",
    dateAfterOrEqual: "The field '#{field}' must be after or equal of '#{args.after}', Current is '#{value}'.",
    dateBeforeOrEqual: "The field '#{field}' must be before or equal of '#{args.before}', Current is '#{value}'.",
    isBool: "The field '#{field}' with the value '#{value}' must be boolean.",
    into: "The field '#{field}' with the value '#{value}' must be between [ #{args.values.join(' | ')} ].",
    isFloat: "The field '#{field}' with the value '#{value}' must be float.",
    isInt: "The field '#{field}' with the value '#{value}' must be integer.",
    max: "The field '#{field}' must have a maximum of #{args.max}, Current is #{value}.",
    min: "The field '#{field}' must have a minimum of #{args.min}, Current is #{value}.",
    nullable: "The field '#{field}' is not defined.",
    match: "The field '#{field}' with the value '#{value}' not match '#{args.regex}'.",
    isIPv4: "The field '#{field}' with the value '#{value}' must be IPv4.",
    isEmail: "The field '#{field}' with the value '#{value}' must be e-mail."
});