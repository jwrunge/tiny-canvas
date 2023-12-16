import { Node_Draw_Settings, Node_Type, PaletteConstructorPreferences, RendererType } from "./common/typesAndDefaults";
import Canvas from "./canvas/Canvas";
import Draw_Node from "./common/DrawNode";

export default class Palette {
    _Renderer: RendererType;
    #registered_nodes: Draw_Node[] = [];

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

    create(type: Node_Type, draw_settings: Node_Draw_Settings) {
        let node = new Draw_Node(type, null, draw_settings);
        this.#registered_nodes.push(node);
        this.#registered_nodes.sort((a, b) => a._z_index - b._z_index);
        return node;
    }

    render() {
        this.#registered_nodes.forEach((node) => {
            node._render();
        });
    }
}