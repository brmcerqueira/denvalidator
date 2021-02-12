import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, isEmail } from "../mod.ts";

Deno.test("isEmail", async () => {
    let data = {
        email: "test@test.com",
        emailTwo: "test@test.com"
    }

    let result = await validate(data, {
        email: [required, isEmail],
        emailTwo: [required, isEmail(value => {
            return { email: value };
        })]
    })

    assert(result.valid);
});

Deno.test("isEmail - fail", async () => {
    let data = {
        email: "test"
    }

    let result = await validate(data, {
        email: [required, isEmail]
    })

    assert(!result.valid);
});