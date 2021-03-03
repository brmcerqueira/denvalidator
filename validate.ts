import { Schema, Rule, RuleResult, ValidateResult, Inconsistencies } from "./schema.ts";
import { ObjectRule } from "./rules/objectRule.ts";
import { ArrayRule } from "./rules/arrayRule.ts";
import { ComplexRule } from "./rules/complexRule.ts";
import { ValidateResultWrapper } from "./wrappers/validateResultWrapper.ts";
import { RootValidateResultWrapper } from "./wrappers/rootValidateResultWrapper.ts";
import { compiledMessages } from "./messages.ts";
import { InconsistencyResult } from "./results/inconsistencyResult.ts";
import { Field } from "./field.ts";
import { DynamicRules } from "./rules/dynamicRules.ts";

type FieldContext = { 
    current: any, 
    inconsistencies?: Inconsistencies
};

function isRule(data: any): data is Rule {
    return data && data.apply && data.call;
}

function isRuleArray(data: any): data is Rule[] {
    return data && Array.isArray(data);
}

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

async function treatDynamicRules(root: any, field: Field, item: DynamicRules, context: FieldContext) {
    const rules = item.rules(root);
    if (isRuleArray(rules)) {
        await treatRuleArray(field, rules, context);
    } 
    else {
        await treatRule(field, rules, context);
    }
}

async function treatRuleArray(field: Field, rules: Rule[], context: FieldContext) {
    for (let i = 0; i < rules.length; i++) {
        await treatRule(field, rules[i], context);
    }
}

async function validateObject(root: any, data: any, schema: Schema, wrapper: ValidateResultWrapper) {
    for (const field in schema) {
        let context: FieldContext = {
            current: data ? data[field] : undefined
        };
        let item = schema[field];
        if (item instanceof ComplexRule) {
            await treatRuleArray(field, item.rules, context);
            if (context.current) {
                if (item instanceof ObjectRule) {
                    await validateObject(root, context.current, item.schema, wrapper.go(field));
                } 
                else if (item instanceof ArrayRule) {
                    let fieldWrapper = wrapper.go(field);
                    let array: any[] = context.current;
    
                    let treat: (index: Field, elementContext: FieldContext) => void;
         
                    if (item.each instanceof DynamicRules) {                     
                        let each = item.each;
                        treat = async function (index: Field, itemContext: FieldContext) {
                            await treatDynamicRules(root, index, each, itemContext);
                        } 
                    } 
                    else if (isRuleArray(item.each)) {
                        let each = item.each;
                        treat = async function (index: Field, itemContext: FieldContext) {
                            await treatRuleArray(index, each, itemContext);
                        }
                    } 
                    else if (isRule(item.each)) {
                        let each = item.each;
                        treat = async function (index: Field, itemContext: FieldContext) {
                            await treatRule(index, each, itemContext);
                        }
                    } 
                    else {
                        let each = item.each;
                        treat = async function (index: Field, itemContext: FieldContext) {
                            await validateObject(root, itemContext.current, each, fieldWrapper.go(index));
                        }                
                    } 
    
                    for (let i = 0; i < array.length; i++) {
                        let itemContext: FieldContext = {
                            current: array[i]
                        };
    
                        await treat(i, itemContext);
    
                        if (itemContext.inconsistencies) {
                            fieldWrapper.put(i, itemContext.inconsistencies);
                        }
                        else {
                            array[i] = itemContext.current;
                        } 
                    }                                   
                } 
            }
        } 
        else if (item instanceof DynamicRules) {
            await treatDynamicRules(root, field, item, context);
        } 
        else if (isRuleArray(item)) {
            await treatRuleArray(field, item, context);
        } 
        else {
            await treatRule(field, item, context);
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
    await validateObject(data, data, schema, rootValidateResultWrapper);
    return rootValidateResultWrapper.result;
}