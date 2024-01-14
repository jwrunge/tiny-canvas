import { Dimensions, Node_Type, TriangleDimensions } from "../types/drawNode";
import { Transform } from "../types/transforms";
import { Node_Draw_Settings, Renderer } from "../types/general";
import type Palette from "../main";

export default class Canvas implements Renderer {
    _root: Palette;

    constructor(root: Palette) {
        this._root = root;
    }

    _draw(type: Node_Type, dimensions: Dimensions, transform: Transform, draw: Node_Draw_Settings) {
        switch(type) {
            case "Ellipse":
                //With option for arcs
                break;
            case "Triangle":
                //With option for right triangle, rounding
                console.log("Drawing triangle", dimensions, transform, draw);
                this._draw_triangle(dimensions as TriangleDimensions, transform, draw);
                break;
            case "Rectangle":
                //With option for rounding
                break;
            case "Star":
                //With option for rounding, multiple points
                break;
            case "Path":
                break;
            case "Text":
                break;
            case "Image":
                break;
            case "Sprite":
                break;
        }
    }

    _draw_triangle(_dimensions: TriangleDimensions, _transform: Transform, _draw: Node_Draw_Settings) {
        const ctx = this._root._ctx;

        //Determine points
        const tri_points = [
            [0, 0],
            [0, 0],
            [0, 0]
        ];

        tri_points[0][0] = _dimensions.base / 2;
        tri_points[1][0] = 0;
        tri_points[1][1] = _dimensions.height;
        tri_points[2][0] = _dimensions.base;
        tri_points[2][1] = _dimensions.height;

        console.log("TRI points", tri_points);

        //Apply transform
        tri_points.forEach((point) => {
            let x = point[0];
            let y = point[1];

            point[0] = x * _transform[0][0] + y * _transform[0][1] + _transform[0][2];
            point[1] = x * _transform[1][0] + y * _transform[1][1] + _transform[1][2];
        });

        console.log("TRI transformed points", tri_points);

        //Draw triangle
        ctx.fillStyle = _draw.color;
        console.log("Fill", ctx.fillStyle)
        ctx.beginPath();
        ctx.moveTo(tri_points[0][0], tri_points[0][1]);
        ctx.lineTo(tri_points[1][0], tri_points[1][1]);
        ctx.lineTo(tri_points[2][0], tri_points[2][1]);
        ctx.fill();
    }    
}