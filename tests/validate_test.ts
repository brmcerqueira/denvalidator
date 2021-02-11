import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate } from "../mod.ts";

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