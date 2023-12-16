import { Transform } from "./typesAndDefaults";

export function matrix_multiply(a: Transform, b: Transform): Transform {
    let result: Transform = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

    for(let i = 0; i < a.length; i++) {
        for(let j = 0; j < b[0].length; j++) {
            for(let k = 0; k < a[0].length; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return result;
}