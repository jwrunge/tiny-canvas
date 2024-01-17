import { Dimensions, Node_Type, TriangleDimensions } from "../types/drawNode";
import { Transform } from "../types/transforms";
import { Node_Draw_Settings, Renderer } from "../types/general";
import type Palette from "../main";
import { applyMatrixToPoint } from "../common/util";

export default class Canvas implements Renderer {
    _root: Palette;

    constructor(root: Palette) {
        this._root = root;
    }

    #draw_path(path: [number, number][]) {
        const ctx = this._root._ctx;
        ctx.beginPath();
        for(let i=0; i<path.length; i++) {
            if(i===0) {
                ctx.moveTo(path[i][0], path[i][1]);
            }
            else {
                ctx.lineTo(path[i][0], path[i][1]);
            }
        }
        
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    _draw(type: Node_Type, dimensions: Dimensions, transform: Transform, transforms: any & { origin: [number, number] }, draw: Node_Draw_Settings) {
        switch(type) {
            case "Ellipse":
                //With option for arcs
                break;
            case "Triangle":
                //With option for right triangle, rounding
                this._draw_triangle(dimensions as TriangleDimensions, transform, transforms, draw);
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

    _draw_triangle(dimensions: TriangleDimensions, transform: Transform, transforms: any & { origin: [number, number] }, draw: Node_Draw_Settings) {
        const ctx = this._root._ctx;

        const mirror_x = transforms.mirror === "x" || transforms.mirror === "xy" ? -1 : 1;
        const mirror_y = transforms.mirror === "y" || transforms.mirror === "xy" ? -1 : 1;
        const scaleX = Math.cos(transforms.rotation) * transforms.scale[0] * mirror_x;
        const scaleY = Math.cos(transforms.rotation) * transforms.scale[1] * mirror_y;
        const skewX = -Math.sin(transforms.rotation) * transforms.skew[0] * mirror_x;
        const skewY = Math.sin(transforms.rotation) * transforms.skew[1] * mirror_y;

        const transMatrix: Transform = [
            scaleX, skewX, transforms.translation[0],
            skewY, scaleY, transforms.translation[1],
            0, 0, 1
        ];

        //Determine points
        const tri_points: [number, number][] = [
            [dimensions.base / 2,   0],
            [dimensions.base,       dimensions.height],
            [0,                     dimensions.height]
        ].map((point) => {
            point = point.map((coord, i) => coord - transforms.origin[i]);
            point = applyMatrixToPoint(transMatrix, point as [number, number]);
            point = point.map((coord, i) => coord + transforms.origin[i]);
            return point as [number, number];
        });

        //Draw triangle
        ctx.fillStyle = draw.color;
        // ctx.strokeStyle = draw.stroke_color;
        this.#draw_path(tri_points);
    }
}