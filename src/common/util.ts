import { Transform } from "./typesAndDefaults";

export function matrix_multiply(a: Transform, b: Transform): Transform {
    let result: Transform = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for(let i = 0; i < 3; i++) {
        for(let j = 0; j < 3; j++) {
            for(let k = 0; k < 3; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }
    return result;
}