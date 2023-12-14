import { PaletteConstructorPreferences } from "../common/typesAndDefaults";

const DRAW_CMD_DEFAULTS = {
    center: [0, 0],
    dimensions: [5, 5],
    rotation: 0,
    blend_mode: "source-over",
}

export default class Canvas {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    #default_color: string;
    #default_units: string;

    constructor(ops: PaletteConstructorPreferences) {
        this.#default_color = ops.default_color || "black";
        this.#default_units = ops.default_units || "px";

        if(typeof ops.canvas === "string") ops.canvas = document.querySelector(ops.canvas) as HTMLCanvasElement | null;
        if(ops.canvas instanceof HTMLCanvasElement) this.canvas = ops.canvas;

        if(!this.canvas) throw new Error("Invalid canvas element!");
        this.ctx = this.canvas?.getContext("2d");

        return this;
    }

    #draw_command(new_props) {
        const props = {
            ...DRAW_CMD_DEFAULTS, 
            color: this.#default_color,
            units: this.#default_units,
            ...new_props
        };

        if(props.units === "%") {
            props.center[0] /= 100 * this.canvas.width;
            props.center[1] /= 100 * this.canvas.height;
            props.dimensions = props.dimensions.map((coord) => {
                return coord / 100 * this.canvas.width;
            });
        }

        return props;
    }

    draw_triangle(ctx, props) {
        this.#draw_command(props);
        let center = props.center || [0, 0];
        let dimensions = props.dimensions || [5, 5];
        let rotation = props.rotation || 0;
        let color = props.color || "black";
    
        ctx.globalCompositeOperation = "xor";
    
        let tri_points = [
            [center[0], center[1] - dimensions[1] / 2],
            [center[0] + dimensions[0] / 2, center[1] + dimensions[1] / 2],
            [center[0] - dimensions[0] / 2, center[1] + dimensions[1] / 2]
        ];
    
        if(rotation) {
            tri_points = tri_points.map((point) => {
                let x = point[0] - center[0];
                let y = point[1] - center[1];
                let newX = x * Math.cos(rotation) - y * Math.sin(rotation);
                let newY = x * Math.sin(rotation) + y * Math.cos(rotation);
                return [newX + center[0], newY + center[1]];
            });
        }
    
        ctx.fillStyle = color;
    
        ctx.beginPath();
        ctx.moveTo(tri_points[0][0], tri_points[0][1]);
        ctx.lineTo(tri_points[1][0], tri_points[1][1]);
        ctx.lineTo(tri_points[2][0], tri_points[2][1]);
        ctx.fill();
    }    
}