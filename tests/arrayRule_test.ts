import { assert, assertEquals, assertStrictEquals, assertThrows } from "https://deno.land/std/testing/asserts.ts";
import { required, validate } from "../mod.ts";
import { array } from "../arrayRule.ts";

Deno.test("array", async () => {
    let data = {
        name: "Test",
        child: [{
            name: "Child"
        }]
    }

    let result = await validate(data, {
        name: [required],
        child: array({
            name: [required]
        })
    })

    assert(result.valid);
});

Deno.test("array - fail", async () => {
    let data = {
        name: "Test",
        child: [{
            name: "Child"
        },{
            name: null
        }]
    }

    let result = await validate(data, {
        name: [required],
        child: array({
            name: [required]
        })
    })

    assert(!result.valid);

    console.log(JSON.stringify(result));
});