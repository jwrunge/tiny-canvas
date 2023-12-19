import { Godlike, Node_Draw_Settings, Node_Type, PaletteConstructorPreferences, RendererType } from "./common/typesAndDefaults";
import Canvas from "./canvas/Canvas";
import Draw_Node from "./common/DrawNode";
import { sort_nodes } from "./common/util";

export default class Palette implements Godlike {
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _Renderer: RendererType;
    #registered_nodes: Draw_Node[] = [];

    constructor(ops: PaletteConstructorPreferences) {
        if(typeof ops.canvas === "string") ops.canvas = document.querySelector(ops.canvas) as HTMLCanvasElement | null;
        if(ops.canvas instanceof HTMLCanvasElement) this._canvas = ops.canvas;

        if(!this._canvas) throw new Error("Invalid canvas element!");
        this._ctx = this._canvas?.getContext("2d");

        switch(ops.mode) {
            case "Canvas":
                this._Renderer = new Canvas(this);
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
    }

    _remove_node(node: Draw_Node) {
        this.#registered_nodes = this.#registered_nodes.filter((n) => n !== node);
    }

    create(type: Node_Type, draw_settings: Node_Draw_Settings) {
        let node = new Draw_Node(this, type, null, draw_settings);
        this.#registered_nodes.push(node);
        sort_nodes(this.#registered_nodes);
        return node;
    }

    destroy(node: Draw_Node) {
        node?.destroy();
    }

    render() {
        this.#registered_nodes.forEach((node) => {
            node._render();
        });
    }
}