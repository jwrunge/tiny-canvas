import type Palette from "../main";
import Draw_Node from "../common/DrawNode";
import { Dimensions, Node_Type, TriangleDimensions, TypeBasedDimensions } from "./drawNode";
import { Transform } from "./transforms";

//Generic
export type Vector2 = [number, number];

//Renderer type imports
import Canvas from "../canvas/Canvas";
// export type WebGL = "WebGL";
// export type WebGPU = "WebGPU";

//Renderer type values
export type Canvas_Renderer = "Canvas";
export type WebGL_Renderer = "WebGL";
export type WebGPU_Renderer = "WebGPU";
export type Renderer_Type = Canvas_Renderer | WebGL_Renderer | WebGPU_Renderer;

export type Typed_Renderer<T extends Renderer_Type> = T extends Canvas_Renderer ? Canvas : never;

export interface Renderer {
    _root: Palette;
    _draw(type: Node_Type, dimensions: Dimensions, transform: Transform, transforms: any & { origin: [number, number] }, draw: Node_Draw_Settings): void,
    _draw_triangle(dimensions: TriangleDimensions, transform: Transform, transforms: any & { origin: [number, number] }, draw: Node_Draw_Settings): void
}

//Palette constructor preferences
export interface PaletteConstructorPreferences {
    canvas?: HTMLCanvasElement | string | null,
    default_color?: string;
    default_units?: "px" | "%" | "w%" | "h%" | "max%" | "min%";
}

//Drawing modes
export type Blend_Mode = "standard" | "xor";

export interface Node_Draw_Settings {
    color: string;
    blend_mode?: Blend_Mode;
}

export const NODE_DRAW_DEFAULTS: Node_Draw_Settings = {
    color: "black",
    blend_mode: "standard",
}

//Create and destroy function models
export interface Godlike {
    create<T extends Node_Type>(
        type: T, 
        dimensions: TypeBasedDimensions<T>, 
        draw_settings: Node_Draw_Settings): Draw_Node<T>;
    destroy(node: Draw_Node<any>): void;
}