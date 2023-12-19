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

    _draw_triangle(_dimensions: TriangleDimensions, _transform: Transform,_draw: Node_Draw_Settings) {
        // let pos = spatial.position || [0, 0];
        // let dimensions = spatial.dimensions || [5, 5];
        // let rotation = spatial.rotation || 0;
        // let color = draw.color || "black";
    
        // ctx.globalCompositeOperation = "xor";
    
        // let tri_points = [
        //     [center[0], center[1] - dimensions[1] / 2],
        //     [center[0] + dimensions[0] / 2, center[1] + dimensions[1] / 2],
        //     [center[0] - dimensions[0] / 2, center[1] + dimensions[1] / 2]
        // ];
    
        // if(rotation) {
        //     tri_points = tri_points.map((point) => {
        //         let x = point[0] - center[0];
        //         let y = point[1] - center[1];
        //         let newX = x * Math.cos(rotation) - y * Math.sin(rotation);
        //         let newY = x * Math.sin(rotation) + y * Math.cos(rotation);
        //         return [newX + center[0], newY + center[1]];
        //     });
        // }
    
        // ctx.fillStyle = color;
    
        // ctx.beginPath();
        // ctx.moveTo(tri_points[0][0], tri_points[0][1]);
        // ctx.lineTo(tri_points[1][0], tri_points[1][1]);
        // ctx.lineTo(tri_points[2][0], tri_points[2][1]);
        // ctx.fill();
    }    
}