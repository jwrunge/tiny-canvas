import { Node_Draw_Settings, Node_Type, PaletteConstructorPreferences, Renderer, Transform } from "../common/typesAndDefaults";

export default class Canvas implements Renderer {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(ops: PaletteConstructorPreferences) {
        if(typeof ops.canvas === "string") ops.canvas = document.querySelector(ops.canvas) as HTMLCanvasElement | null;
        if(ops.canvas instanceof HTMLCanvasElement) this.canvas = ops.canvas;

        if(!this.canvas) throw new Error("Invalid canvas element!");
        this.ctx = this.canvas?.getContext("2d");

        return this;
    }

    _draw(type: Node_Type, draw: Node_Draw_Settings, transform: Transform) {
        switch(type) {
            case "Ellipse":
                break;
            case "Triangle":
                this._draw_triangle(this.ctx, draw, transform);
                break;
            case "Rectangle":
                break;
            case "Star":
                break;
            case "Line":
                break;
            case "Path":
                break;
            case "Text":
                break;
            case "Sprite":
                break;
        }
    }

    _draw_triangle(ctx: CanvasRenderingContext2D, draw: Node_Draw_Settings, transform: Transform) {
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