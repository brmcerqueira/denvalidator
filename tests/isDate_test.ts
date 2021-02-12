import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, isDate, dateAfterOrEqual, dateBeforeOrEqual } from "../mod.ts";

Deno.test("isDate", async () => {
    let data = {
        dateOne: new Date(),
        dateTwo: "2000-01-01T12:00:00.000Z"
    }

    let result = await validate(data, {
        dateOne: [required, isDate],
        dateTwo: [required, isDate, dateAfterOrEqual(new Date(2000, 0, 1)), dateBeforeOrEqual(new Date(2000, 0, 2))]
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

Deno.test("isDate - dateAfterOrEqual - fail", async () => {
    let data = {
        dateOne: "1999-01-01T12:00:00.000Z"
    }

    let result = await validate(data, {
        dateOne: [required, isDate, dateAfterOrEqual(new Date(2000, 0, 1))]
    })

    assert(!result.valid);
});

Deno.test("isDate - dateBeforeOrEqual - fail", async () => {
    let data = {
        dateOne: "2000-01-02T12:00:00.000Z"
    }

    let result = await validate(data, {
        dateOne: [required, isDate, dateBeforeOrEqual(new Date(2000, 0, 1))]
    })

    assert(!result.valid);
});