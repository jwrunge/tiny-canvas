import { Node_Draw_Settings, Node_Type, RendererType, type Spatial } from "./typesAndDefaults";
import Draw_Node_Type from "./DrawNodeType";

export default class Draw_Node {
    _spatial?: Spatial;
    _parent?: Draw_Node;
    _Renderer: RendererType;

    constructor() {
        this._Renderer = this._parent?._Renderer;
        return this;
    }

    _transform() {

    }

    set_spatial(spatial: Partial<Spatial>) {
        this._spatial = {...this._spatial, ...spatial};
        console.log(this._spatial)
    }

    scale(x: number, y: number) {
        console.log(x, y)
        this._transform();
    }

    rotate(angle: number, units: "deg" | "rad" = "deg") {
        console.log(angle, units)
        this._transform();
    }

    translate(x: number, y: number) {
        console.log(x, y)
        this._transform();
    }

    skew(x: number, y: number) {
        console.log(x, y)
        this._transform();
    }

    create(type: Node_Type, draw_settings: Node_Draw_Settings) {
        return new Draw_Node_Type(type, this, draw_settings);
    }
}