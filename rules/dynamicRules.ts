import { InconsistencyResult } from "../results/inconsistencyResult.ts";
import { RuleResult, Rules } from "../schema.ts";

function rulesNotFound(data: any): RuleResult {
    return new InconsistencyResult(data);
}

export function choose<T>(treat: (parent: T) => Rules | null): DynamicRules {
    return new DynamicRules(treat);
}

export function when<T>(check: (parent: T) => boolean, rules: Rules): DynamicRules {
    return new DynamicRules(p => check(p) ? rules : null);
}

export class DynamicRules {
    constructor(private treat: (parent: any) => Rules | null) {
    }

    public rules(parent: any): Rules {
        return this.treat(parent) || [rulesNotFound];
    }
}