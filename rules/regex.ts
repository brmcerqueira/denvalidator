import { RuleResult, Rule } from "../schema.ts";
import { InconsistencyResult } from "../results/inconsistencyResult.ts";
import { TransformResult } from "../results/transformResult.ts";

export function treatRegex(data: any, regex: RegExp, ignoreCase: boolean, parse?: (data: string) => any): RuleResult {
    if (typeof data === "string" && !regex.test(ignoreCase ? data.toLowerCase() : data)) {
        return new InconsistencyResult(data, { regex: regex });
    }
    return parse ? new TransformResult(parse(data)) : null;
}

export function match(regex: RegExp, parse?: (data: string) => any): Rule {
    return function match(data: any): RuleResult {
        return treatRegex(data, regex, false, parse);
    };
}

export function isIPv4(parse: (data: string) => any): Rule
export function isIPv4(data: any): RuleResult
export function isIPv4(arg1: any | ((data: string) => any)): Rule | RuleResult {
    let regex = /^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/;
    return arg1 instanceof Function ? function isIPv4(data: any): RuleResult {
        return treatRegex(data, regex, false, arg1);
    } : treatRegex(arg1, regex, false);
}

export function isEmail(parse: (data: string) => any): Rule
export function isEmail(data: any): RuleResult
export function isEmail(arg1: any | ((data: string) => any)): Rule | RuleResult {
    let regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return arg1 instanceof Function ? function isEmail(data: any): RuleResult {
        return treatRegex(data, regex, true, arg1);
    } : treatRegex(arg1, regex, true);
}