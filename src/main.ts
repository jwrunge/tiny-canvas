import { PaletteConstructorPreferences, RendererType } from "./common/typesAndDefaults";
import Canvas from "./canvas/Canvas";

export default class Palette {
    _Renderer: RendererType;

    constructor(ops: PaletteConstructorPreferences) {
        switch(ops.mode) {
            case "Canvas":
                this._Renderer = new Canvas(ops);
                break;
            case "WebGL":
                throw new Error("WebGL not yet implemented!");
                break;
            case "WebGPU":
                throw new Error("WebGPU not yet implemented!");
                break;
            default:
                throw new Error("Invalid mode!");
        }
        return this;
    }
}