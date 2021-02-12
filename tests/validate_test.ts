import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, nullable } from "../mod.ts";

Deno.test("required", async () => {
    let data = {
        name: "Test",
        lastname: "Test"
    }

    let result = await validate(data, {
        name: [required]
    })

    assert(result.valid);

    assert(!data.lastname);
});

Deno.test("required - fail", async () => {
    let data = {}

    let result = await validate(data, {
        name: [required]
    })

    assert(!result.valid);
});

Deno.test("nullable", async () => {
    let data = {
        name: null,
        lastname: "Test"
    }

    let result = await validate(data, {
        name: [nullable],
        lastname: [nullable]
    })

    assert(result.valid);
});


Deno.test("nullable - fail", async () => {
    let data = {}

    let result = await validate(data, {
        name: [nullable]
    })

    assert(!result.valid);
});