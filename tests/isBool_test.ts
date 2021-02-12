import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, isBool } from "../mod.ts";

Deno.test("isBool", async () => {
    let data = {
        value: true,
        valueTwo: false
    }

    let result = await validate(data, {
        value: [required, isBool],
        valueTwo: [required, isBool],
    })

    assert(result.valid);
});

Deno.test("isBool - fail", async () => {
    let data = {
        value: "test"
    }

    let result = await validate(data, {
        value: [required, isBool]
    })

    assert(!result.valid);
});