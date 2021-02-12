import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, isFloat, min, max } from "../mod.ts";

Deno.test("isFloat", async () => {
    let data = {
        value: 1.3,
        valueTwo: "1.7"
    }

    let result = await validate(data, {
        value: [required, isFloat, min(1), max(2)],
        valueTwo: [required, isFloat, min(1), max(2)],
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

Deno.test("isFloat - min - fail", async () => {
    let data = {
        value: 1.5
    }

    let result = await validate(data, {
        value: [required, isFloat, min(2)]
    })

    assert(!result.valid);
});

Deno.test("isFloat - max - fail", async () => {
    let data = {
        value: 2.5
    }

    let result = await validate(data, {
        value: [required, isFloat, max(1)]
    })

    assert(!result.valid);
});