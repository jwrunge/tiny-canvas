import Canvas from "../canvas/Canvas";

export interface PaletteConstructorPreferences {
    mode: Mode,
    canvas?: HTMLCanvasElement | string | null,
    default_color?: string;
    default_units?: "px" | "%" | "w%" | "h%" | "max%" | "min%";
}

export type Mode = "Canvas" | "WebGL" | "WebGPU";
export type RendererType = Canvas;
export type Node_Type = "Ellipse" | "Triangle" | "Rectangle" | "Star" | "Line" | "Path" | "Text" | "Sprite";
export type Blend_Mode = "standard" | "xor";
export type Vector2 = [number, number];

type TransX = number;
type TransY = number;
type ScaleX = number;
type ScaleY = number;
type ShearX = number;
type ShearY = number;

// Transform matrix example

export type Transform = [[ ScaleX, ShearX, TransX ],
                         [ ShearY, ScaleY, TransY ],
                         [ 0,      0,      1      ]];

export interface Renderer {
    _draw(type: Node_Type, draw: Node_Draw_Settings, transform: Transform): void,
    _draw_triangle(ctx: CanvasRenderingContext2D, draw: Node_Draw_Settings, transform: Transform): void
}

export interface Node_Draw_Settings {
    color: string;
    blend_mode?: Blend_Mode;
}

export const NODE_DRAW_DEFAULTS: Node_Draw_Settings = {
    color: "black",
    blend_mode: "standard",
}