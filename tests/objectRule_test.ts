import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, object, optional } from "../mod.ts";

Deno.test("object", async () => {
    let data = {
        name: "Test",
        child: {
            name: "Child",
            lastname: "Test"
        }
    }

    let result = await validate(data, {
        name: [required],
        child: object({
            name: [required]
        })
    })

    assert(result.valid);

    assert(!data.child.lastname);
});

Deno.test("object - 2", async () => {
    let data = {
        name: "Test"
    }

    let result = await validate(data, {
        name: [required],
        child: object(optional, {
            name: [required]
        })
    })

    assert(result.valid);
});

Deno.test("object - fail", async () => {
    let data = {
        name: "Test",
        child: {
            name: null
        }
    }

    let result = await validate(data, {
        name: [required],
        child: object({
            name: [required]
        })
    })

    assert(!result.valid);
});

Deno.test("object - fail - 2", async () => {
    let data = {
        name: "Test"
    }

    let result = await validate(data, {
        name: [required],
        child: object({
            name: [required]
        })
    })

    assert(!result.valid);
});