import Canvas from "../canvas/Canvas";
import type Palette from "../main";
import Draw_Node from "./DrawNode";

export interface PaletteConstructorPreferences {
    mode: Mode,
    canvas?: HTMLCanvasElement | string | null,
    default_color?: string;
    default_units?: "px" | "%" | "w%" | "h%" | "max%" | "min%";
}

export type Mode = "Canvas" | "WebGL" | "WebGPU";
export type RendererType = Canvas;
export type Node_Type = "Ellipse" | "Triangle" | "Rectangle" | "Star" | "Path" | "Text" | "Image" | "Sprite";
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

export interface CircularDimensions {
    radius: number
}

export interface EllipseDimensions {
    radius_x: number,
    radius_y: number
}

export interface RectangleDimensions {
    width: number,
    height: number
}

export interface StarDimensions {
    radius: number,
    points: number
}

export interface TriangleDimensions {
    base: number,
    height: number
}

export type Dimensions = CircularDimensions | EllipseDimensions | RectangleDimensions | StarDimensions | TriangleDimensions;

export interface Renderer {
    _root: Palette;
    _draw(type: Node_Type, dimensions: Dimensions, transform: Transform, draw: Node_Draw_Settings): void,
    _draw_triangle(dimensions: TriangleDimensions, transform: Transform, draw: Node_Draw_Settings): void
}

export interface Godlike {
    create(type: Node_Type, draw_settings: Node_Draw_Settings): Draw_Node;
    destroy(node: Draw_Node): void;
}

export interface Node_Draw_Settings {
    color: string;
    blend_mode?: Blend_Mode;
}

export const NODE_DRAW_DEFAULTS: Node_Draw_Settings = {
    color: "black",
    blend_mode: "standard",
}