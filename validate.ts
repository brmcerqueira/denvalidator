import { Schema, Rule, RuleResult, ValidateResult, Inconsistencies, ComplexRules } from "./schema.ts";
import { ObjectRule } from "./rules/objectRule.ts";
import { ArrayRule } from "./rules/arrayRule.ts";
import { ComplexRule } from "./rules/complexRule.ts";
import { ValidateResultWrapper } from "./wrappers/validateResultWrapper.ts";
import { RootValidateResultWrapper } from "./wrappers/rootValidateResultWrapper.ts";
import { compiledMessages } from "./messages.ts";
import { InconsistencyResult } from "./results/inconsistencyResult.ts";
import { Field } from "./field.ts";
import { DynamicRule } from "./rules/dynamicRule.ts";
import { isRuleArray, isRule } from "./utils.ts";

type FieldContext = { 
    current: any, 
    inconsistencies?: Inconsistencies
};

function isPromiseRuleResult(data: any): data is Promise<RuleResult> {
    return data && data.then;
}

async function treatRule(field: Field, rule: Rule, context: FieldContext) {
    let result = rule(context.current);
    if (result && isPromiseRuleResult(result)) {
        result = await result;
    }

    if (result) {
        if (result instanceof InconsistencyResult) {
            context.inconsistencies = context.inconsistencies || {};
            let message = compiledMessages[rule.name] || compiledMessages.$default;
            context.inconsistencies[rule.name] = message(field, result);
        } else {
            context.current = result.value;
        }
    }
}

async function treatRuleArray(field: Field, rules: Rule[], context: FieldContext) {
    for (let i = 0; i < rules.length; i++) {
        await treatRule(field, rules[i], context);
    }
}

async function validateArray(array: any[], rule: ArrayRule, wrapper: ValidateResultWrapper) {
    let treat: (index: Field, elementContext: FieldContext) => Promise<boolean>;

    if (rule.each instanceof ComplexRule) {
        let each = rule.each;
        let treatComplexRule: (index: Field, elementContext: FieldContext) => Promise<void>;
        
        if (each instanceof ArrayRule) {
            treatComplexRule = async function (index: Field, itemContext: FieldContext) {
                await validateArray(itemContext.current, <ArrayRule> each, wrapper.go(index));
            }
        }
        else if (each instanceof ObjectRule) {
            let schema = each.schema;
            treatComplexRule = async function (index: Field, itemContext: FieldContext) {
                await validateObject(itemContext.current, schema, wrapper.go(index));
            }  
        }

        treat = async function (index: Field, itemContext: FieldContext): Promise<boolean> {
            await treatRuleArray(index, each.rules, itemContext);

            if (itemContext.current) {
                await treatComplexRule(index, itemContext);
            }
      
            return false;
        }
    }
    else if (rule.each instanceof DynamicRule) {
        let each = rule.each;
        treat = async function (index: Field, itemContext: FieldContext): Promise<boolean> {
            const rules = each.rules(itemContext.current);
            if (rules) {
                await treatField(index, rules, itemContext, wrapper);
                return false;
            } 
            return true;
        }
    } 
    else if (isRuleArray(rule.each)) {
        let each = rule.each;
        treat = async function (index: Field, itemContext: FieldContext): Promise<boolean> {
            await treatRuleArray(index, each, itemContext);
            return false;
        }
    } 
    else if (isRule(rule.each)) {
        let each = rule.each;
        treat = async function (index: Field, itemContext: FieldContext): Promise<boolean> {
            await treatRule(index, each, itemContext);
            return false;
        }
    }     
    else {
        let each = rule.each;
        treat = async function (index: Field, itemContext: FieldContext): Promise<boolean> {
            await validateObject(itemContext.current, each, wrapper.go(index));
            return false;
        }                
    }  

    for (let i = 0; i < array.length; i++) {
        let itemContext: FieldContext = {
            current: array[i]
        };

        if (await treat(i, itemContext)) {
            array.splice(i, 1);
        }
        else if (itemContext.inconsistencies) {
            wrapper.put(i, itemContext.inconsistencies);
        }
        else {
            array[i] = itemContext.current;
        } 
    }
}

async function treatField(field: Field, rules: ComplexRules, context: FieldContext, wrapper: ValidateResultWrapper) {
    if (rules instanceof ComplexRule) {
        await treatRuleArray(field, rules.rules, context);
        if (context.current) {
            if (rules instanceof ObjectRule) {
                await validateObject(context.current, rules.schema, wrapper.go(field));
            } 
            else if (rules instanceof ArrayRule) {
                await validateArray(context.current, rules, wrapper.go(field));                                 
            } 
        }
    } 
    else if (isRuleArray(rules)) {
        await treatRuleArray(field, rules, context);
    } 
    else {
        await treatRule(field, rules, context);
    } 
}

async function validateObject(data: any, schema: Schema, wrapper: ValidateResultWrapper) {
    for (const field in schema) {
        const context: FieldContext = {
            current: data ? data[field] : undefined
        };

        const rule = schema[field];

        if (rule instanceof DynamicRule) {
            const rules = rule.rules(data);
            if (rules) {
                await treatField(field, rules, context, wrapper);
            } 
            else {
                delete data[field];
            }       
        }
        else {
            await treatField(field, rule, context, wrapper);
        }

        if (context.inconsistencies) {
            wrapper.put(field, context.inconsistencies);
        }
        else if (data) {
            data[field] = context.current;
        }     
    }

    if (data) {
        for (const field in data) {
            if (!schema[field]) {
                delete data[field];
            }
        }
    }
}

export async function validate(data: any, schema: Schema): Promise<ValidateResult> {
    const rootValidateResultWrapper = new RootValidateResultWrapper();
    await validateObject(data, schema, rootValidateResultWrapper);
    return rootValidateResultWrapper.result;
}