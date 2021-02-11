import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, isEnum } from "../mod.ts";

enum TestEnum {
    ValueOne,
    ValueTwo,
}

Deno.test("isEnum", async () => {
    let data = {
        enumOne: TestEnum.ValueOne,
        enumTwo: "ValueTwo",
        enumThree: 0,
    }
    TestEnum
    let result = await validate(data, {
        enumOne: [required, isEnum(TestEnum)],
        enumTwo: [required, isEnum(TestEnum)],
        enumThree: [required, isEnum(TestEnum)]
    })

    assert(result.valid);
});