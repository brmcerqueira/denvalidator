import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, isEnum } from "../mod.ts";
import { array } from "../rules/arrayRule.ts";

enum TestEnum {
    ValueOne,
    ValueTwo,
}

Deno.test("isEnum", async () => {
    let data = {
        enumOne: TestEnum.ValueOne,
        enumTwo: "ValueTwo",
        enumThree: 0,
        enumArray: ["ValueTwo"]
    }
    
    let result = await validate(data, {
        enumOne: [required, isEnum(TestEnum)],
        enumTwo: [required, isEnum(TestEnum)],
        enumThree: [required, isEnum(TestEnum)],
        enumArray: array(isEnum(TestEnum)),
    })

    assert(result.valid);
});

Deno.test("isEnum - fail", async () => {
    let data = {
        enumOne: 9,
        enumTwo: "ValueNine"
    }
    
    let result = await validate(data, {
        enumOne: [required, isEnum(TestEnum)],
        enumTwo: [required, isEnum(TestEnum)]
    })

    assert(!result.valid);
});