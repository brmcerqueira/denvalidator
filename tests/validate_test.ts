import { assert, assertEquals, assertStrictEquals, assertThrows } from "https://deno.land/std/testing/asserts.ts";
import { required, validate } from "../mod.ts";
import { object } from "../objectRule.ts";

Deno.test("required", async () => {
    let data = {
        name: "Test"
    }

    let result = await validate(data, {
        name: [required]
    })

    assert(result.valid);
});

Deno.test("required - fail", async () => {
    let data = {}

    let result = await validate(data, {
        name: [required]
    })

    assert(!result.valid);
});

Deno.test("object", async () => {
    let data = {
        name: "Test",
        child: {
            name: "Child"
        }
    }

    let result = await validate(data, {
        name: [required],
        child: object({
            name: [required]
        })
    })

    assert(result.valid);
});

Deno.test("object - 2", async () => {
    let data = {
        name: "Test"
    }

    let result = await validate(data, {
        name: [required],
        child: object(false, {
            name: [required]
        })
    })

    console.log(JSON.stringify(result));

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