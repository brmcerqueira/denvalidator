import { assert } from "https://deno.land/std/testing/asserts.ts";
import { required, validate, isIPv4 } from "../mod.ts";

Deno.test("isIPv4", async () => {
    let data = {
        ip: "192.168.0.1",
        ipTwo: "192.168.0.1"
    }

    let result = await validate(data, {
        ip: [required, isIPv4],
        ipTwo: [required, isIPv4(value => {
            return { ip: value };
        })]
    })

    assert(result.valid);
});

Deno.test("isIPv4 - fail", async () => {
    let data = {
        ip: "test"
    }

    let result = await validate(data, {
        ip: [required, isIPv4]
    })

    assert(!result.valid);
});