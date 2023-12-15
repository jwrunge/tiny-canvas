import { PaletteConstructorPreferences } from "./common/typesAndDefaults";
import Canvas from "./canvas/Canvas";
import Draw_Node from "./common/DrawNode";

export default class Palette extends Draw_Node {
    constructor(ops: PaletteConstructorPreferences) {
        super();
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