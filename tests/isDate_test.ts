import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, isDate } from "../mod.ts";

Deno.test("isDate", async () => {
    let data = {
        dateOne: new Date(),
        dateTwo: "2000-01-01T12:00:00.000Z"
    }

    let result = await validate(data, {
        dateOne: [required, isDate],
        dateTwo: [required, isDate]
    })

    assert(result.valid);
});

Deno.test("isDate - fail", async () => {
    let data = {
        dateOne: "xxxx"
    }

    let result = await validate(data, {
        dateOne: [required, isDate]
    })

    assert(!result.valid);
});