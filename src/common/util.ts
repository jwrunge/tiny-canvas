import { Transform } from "./typesAndDefaults";

export function matrix_multiply(a: Transform, b: Transform): Transform {
    let result: number[] = [];
    for(let i = 0; i < a.length; i++) {
        result.push(a[i] * b[i]);
    }
    return result as Transform;
}