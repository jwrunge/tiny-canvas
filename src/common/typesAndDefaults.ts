export interface PaletteConstructorPreferences {
    mode: Mode,
    canvas?: HTMLCanvasElement | string | null,
    default_color?: string;
    default_units?: "px" | "%" | "w%" | "h%" | "max%" | "min%";
}

export type Mode = "Canvas" | "WebGL" | "WebGPU";
export type Node_Type = "Ellipse" | "Triangle" | "Rectangle" | "Star" | "Line" | "Path" | "Text" | "Sprite";
export type Blend_Mode = "standard" | "xor";
export type Vector2 = [number, number];
export type Transform = [number, number, number, number, number, number];

export interface Spatial {
    position: Vector2;
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