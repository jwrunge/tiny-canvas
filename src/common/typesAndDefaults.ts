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
type Rotation = number;
type SkewX = number;
type SkewY = number;

// Transform matrix example

export type Transform = [number, number, number][];

export interface Renderer {
    _draw(type: Node_Type, draw: Node_Draw_Settings, spatial: Spatial): void,
    _draw_triangle(ctx: CanvasRenderingContext2D, draw: Node_Draw_Settings, spatial: Spatial): void
}

export interface Spatial {
    position: Vector2;
    dimensions: Vector2;
    transform: Transform;
}

export interface Node_Draw_Settings {
    color: string;
    blend_mode?: Blend_Mode;
}

export const NODE_DRAW_DEFAULTS: Node_Draw_Settings = {
    color: "black",
    blend_mode: "standard",
}