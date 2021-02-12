import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, isInt } from "../mod.ts";

Deno.test("isInt", async () => {
    let data = {
        value: 1,
        valueTwo: "2"
    }

    let result = await validate(data, {
        value: [required, isInt],
        valueTwo: [required, isInt],
    })

    assert(result.valid);
});

Deno.test("isInt - fail", async () => {
    let data = {
        value: 1.7
    }

    let result = await validate(data, {
        value: [required, isInt]
    })

    assert(!result.valid);
});

Deno.test("isInt - fail - 2", async () => {
    let data = {
        value: "xxx"
    }

    let result = await validate(data, {
        value: [required, isInt]
    })

    assert(!result.valid);
});