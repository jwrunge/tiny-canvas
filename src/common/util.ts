import Draw_Node from "./DrawNode";
import { Transform } from "../types/transforms";

export function sort_nodes(nodes: Draw_Node<any>[], reverse = false) {
    if(reverse) nodes.reverse();
    nodes.sort((a, b) => (a._ancestry_index - b._ancestry_index) + (a._z_index - b._z_index));
}

export function matrix_multiply(a: Transform, b: Transform): Transform {
    let result: Transform = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];

    console.log(a, b)
    for(let i = 0; i < a.length; i++) {
        for(let j = 0; j < b[0].length; j++) {
            for(let k = 0; k < a[0].length; k++) {
                result[i][j] += a[i][k] * b[k][j];
            }
        }
    }

    return result;
}

export function matrix_add(a: Transform, b: Transform): Transform {
    let result: Transform = [[0, 0, 0], [0, 0, 0], [0, 0, 1]];

    for(let i = 0; i < a.length; i++) {
        for(let j = 0; j < a[0].length; j++) {
            result[i][j] = a[i][j] + b[i][j];
        }
    }

    return result;
}

export function matrix_subtract(a: Transform, b: Transform): Transform {
    let result: Transform = [[0, 0, 0], [0, 0, 0], [0, 0, 1]];

    for(let i = 0; i < a.length; i++) {
        for(let j = 0; j < a[0].length; j++) {
            result[i][j] = a[i][j] - b[i][j];
        }
    }

    return result;
}