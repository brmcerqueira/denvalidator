import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, isInt, min, max } from "../mod.ts";

Deno.test("isInt", async () => {
    let data = {
        value: 1,
        valueTwo: "2"
    }

    let result = await validate(data, {
        value: [required, isInt, min(1), max(2)],
        valueTwo: [required, isInt, min(1), max(2)],
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


Deno.test("isInt - min - fail", async () => {
    let data = {
        value: 1
    }

    let result = await validate(data, {
        value: [required, isInt, min(2)]
    })

    assert(!result.valid);
});

Deno.test("isInt - max - fail", async () => {
    let data = {
        value: 2
    }

    let result = await validate(data, {
        value: [required, isInt, max(1)]
    })

    assert(!result.valid);
});