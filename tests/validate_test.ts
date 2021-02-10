import { assert, assertEquals, assertStrictEquals, assertThrows } from "https://deno.land/std/testing/asserts.ts";
import { required, validate } from "../mod.ts";

Deno.test("simple", async () => {
    let data = {
        name: "Test"
    }

    let result = await validate(data, {
        name: [required]
    })

    assert(result.valid);
});