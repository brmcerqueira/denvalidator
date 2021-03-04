import { assert } from "https://deno.land/std/testing/asserts.ts";
import { choose, isBool, isInt, isString, required, Schema, validate, array } from "../mod.ts";

type Child = {
    index: number
}

Deno.test("choose", async () => {
    let data = {
        child: [
            { index: 4, valueTwo: true },
            { index: 1, value: "Value 1", valueTwo: 1 },
            { index: 4, valueTwo: true },
            { index: 2, value: 2 },
            { index: 4, valueTwo: true },
            { index: 3, valueTwo: true },
            { index: 4, valueTwo: true }
        ]
    }
    
    let result = await validate(data, {
        child: array(choose<Child>(d => {
            let result: Schema | null = null;
            switch (d.index) {
                case 1:
                    result = {
                        index: [required, isInt],
                        value: [required, isString],
                        valueTwo: [required, isInt],
                    }
                    break;
                case 2:
                    result = {
                        index: [required, isInt],
                        value: [required, isInt]
                    }
                    break;
                case 3:
                    result = {
                        index: [required, isInt],
                        valueTwo: [required, isBool],
                    }
                    break;
            }
            return result;
        }))
    })

    assert(result.valid);
});

Deno.test("choose - fail", async () => {
    let data = {
        child: [
            { index: 1, value: "Value 1", valueTwo: 1 },
            { index: 2, value: 2 },
            { index: 3, valueTwo: 1 }
        ]
    }
    
    let result = await validate(data, {
        child: array(choose<Child>(d => {
            let result: Schema | null = null;
            switch (d.index) {
                case 1:
                    result = {
                        index: [required, isInt],
                        value: [required, isString],
                        valueTwo: [required, isInt],
                    }
                    break;
                case 2:
                    result = {
                        index: [required, isInt],
                        value: [required, isInt]
                    }
                    break;
                case 3:
                    result = {
                        index: [required, isInt],
                        valueTwo: [required, isBool],
                    }
                    break;
            }
            return result;
        }))
    })

    assert(!result.valid);
});