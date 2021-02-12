import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, into } from "../mod.ts";

Deno.test("into", async () => {
    let data = {
        value: 1
    }

    let result = await validate(data, {
        value: [required, into(0, 1, 2)]
    })

    assert(result.valid);
});

Deno.test("into - fail", async () => {
    let data = {
        value: 7
    }

    let result = await validate(data, {
        value: [required, into(0, 1, 2)]
    })

    assert(!result.valid);
});