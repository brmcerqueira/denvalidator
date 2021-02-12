import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, isFloat } from "../mod.ts";

Deno.test("isFloat", async () => {
    let data = {
        value: 1.3,
        valueTwo: "1.7"
    }

    let result = await validate(data, {
        value: [required, isFloat],
        valueTwo: [required, isFloat],
    })

    assert(result.valid);
});

Deno.test("isFloat - fail", async () => {
    let data = {
        value: 1
    }

    let result = await validate(data, {
        value: [required, isFloat]
    })

    assert(!result.valid);
});

Deno.test("isFloat - fail - 2", async () => {
    let data = {
        value: "xxx"
    }

    let result = await validate(data, {
        value: [required, isFloat]
    })

    assert(!result.valid);
});