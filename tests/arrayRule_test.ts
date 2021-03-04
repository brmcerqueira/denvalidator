import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, array, isString, minLength, maxLength } from "../mod.ts";

Deno.test("array", async () => {
    let data = {
        name: "Test",
        child: [{
            name: "Child"
        }],
        childTwo: [
            ["Item 1", "Item 2"],
            ["Item 3", "Item 4"]
        ]
    }

    let result = await validate(data, {
        name: [required],
        child: array({
            name: [required]
        }),
        childTwo: array(array(isString))
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
});

Deno.test("array - minLength - fail", async () => {
    let data = {
        name: "Test",
        child: [{
            name: "Child"
        },{
            name: "Child"
        }]
    }

    let result = await validate(data, {
        name: [required],
        child: array([required, minLength(3)], {
            name: [required]
        })
    })

    assert(!result.valid);
});

Deno.test("array - maxLength - fail", async () => {
    let data = {
        name: "Test",
        child: [{
            name: "Child"
        },{
            name: "Child"
        }]
    }

    let result = await validate(data, {
        name: [required],
        child: array([required, maxLength(1)], {
            name: [required]
        })
    })

    assert(!result.valid);
});

Deno.test("array - primitive", async () => {
    let data = {
        name: "Test",
        child: [ "ChildOne", "ChildTwo" ]
    }

    let result = await validate(data, {
        name: [required],
        child: array(isString)
    })

    assert(result.valid);
});

Deno.test("array - primitive - fail", async () => {
    let data = {
        name: "Test",
        child: [ "ChildOne", 1 ]
    }

    let result = await validate(data, {
        name: [required],
        child: array(isString)
    })

    assert(!result.valid);
});