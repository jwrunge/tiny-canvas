import Draw_Node from "./DrawNode";
import { Transform } from "../types/transforms";
import { CircularDimensions, Dimensions, EllipseDimensions, RectangleDimensions, TriangleDimensions } from "../types/drawNode";

export function sort_nodes(nodes: Draw_Node<any>[], reverse = false) {
    if(reverse) nodes.reverse();
    nodes.sort((a, b) => (a._ancestry_index - b._ancestry_index) + (a._z_index - b._z_index));
}

export function matrix_multiply(m: { main: Transform, modify: Transform }) {
    for(let i = 0; i < m.main.length; i++) {
        m.main[i][0] = m.main[i][0] * m.modify[0][0] + m.main[i][1] * m.modify[1][0] + m.main[i][2] * m.modify[2][0];
        m.main[i][1] = m.main[i][0] * m.modify[0][1] + m.main[i][1] * m.modify[1][1] + m.main[i][2] * m.modify[2][1];
        m.main[i][2] = m.main[i][0] * m.modify[0][2] + m.main[i][1] * m.modify[1][2] + m.main[i][2] * m.modify[2][2];
    }
}

export function matrix_add(m: { main: Transform, modify: Transform }, subtract = false) {
    for(let i = 0; i < m.main.length; i++) {
        m.main[i][0] = subtract ? m.main[i][0] - m.modify[0][0] : m.main[i][0] + m.modify[0][0];
        m.main[i][1] = subtract ? m.main[i][1] - m.modify[1][0] : m.main[i][1] + m.modify[1][0];
        m.main[i][2] = subtract ? m.main[i][2] - m.modify[2][0] : m.main[i][2] + m.modify[2][0];
    }
}

export function width_height_from_dimensions(dimensions: Dimensions) {
    if(dimensions.hasOwnProperty("width")) return [(dimensions as RectangleDimensions).width, (dimensions as RectangleDimensions).height];
    if(dimensions.hasOwnProperty("radius")) return [(dimensions as CircularDimensions).radius * 2, (dimensions as CircularDimensions).radius * 2];
    if(dimensions.hasOwnProperty("base")) return [(dimensions as TriangleDimensions).base, (dimensions as TriangleDimensions).height];
    if(dimensions.hasOwnProperty("radius_x") && dimensions.hasOwnProperty("radius_y")) return [(dimensions as EllipseDimensions).radius_x, (dimensions as EllipseDimensions).radius_y];
    else return [0, 0];
}

export function applyMatrixToPoint(matrix: Transform, point: [number, number]): [number, number] {
    const result: [number, number] = [0, 0];
    result[0] = matrix[0] * point[0] + matrix[1] * point[1] + matrix[4];
    result[1] = matrix[2] * point[0] + matrix[3] * point[1] + matrix[5];
    return result;
}