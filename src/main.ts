import { Node_Type, TypeBasedDimensions } from "./types/drawNode";
import { Godlike, Renderer_Type, Node_Draw_Settings, PaletteConstructorPreferences, Typed_Renderer } from "./types/general";
import Canvas from "./canvas/Canvas";
import Draw_Node from "./common/DrawNode";
import { sort_nodes } from "./common/util";

export default class Palette implements Godlike {
    _canvas: HTMLCanvasElement;
    _ctx: CanvasRenderingContext2D;
    _Renderer: Typed_Renderer<Renderer_Type>;
    #registered_nodes: Draw_Node<any>[] = [];

    constructor(mode: Renderer_Type, ops: PaletteConstructorPreferences) {
        if(typeof ops.canvas === "string") ops.canvas = document.querySelector(ops.canvas) as HTMLCanvasElement | null;
        if(ops.canvas instanceof HTMLCanvasElement) this._canvas = ops.canvas;

        if(!this._canvas) throw new Error("Invalid canvas element!");
        this._ctx = this._canvas?.getContext("2d");

        switch(mode) {
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

    _remove_node(node: Draw_Node<any>) {
        this.#registered_nodes = this.#registered_nodes.filter((n) => n !== node);
    }

    create<T extends Node_Type>(type: T, dimensions: TypeBasedDimensions<T>, draw_settings: Node_Draw_Settings) {
        let node = new Draw_Node(this, type, null, dimensions, draw_settings);
        this.#registered_nodes.push(node);
        sort_nodes(this.#registered_nodes);
        return node;
    }

    destroy(node: Draw_Node<any>) {
        node?.destroy();
    }

    render() {
        this.#registered_nodes.forEach((node) => {
            node._render();
        });
    }
}