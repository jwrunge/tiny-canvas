import { Node_Draw_Settings, Node_Type, RendererType, Transform } from "./typesAndDefaults";
import { matrix_multiply } from "./util";

export default class Draw_Node {
    _local_transform: Transform;
    _transform_mask: Transform;
    _parent: Draw_Node;
    _ancestry?: Draw_Node[] = [];
    _Renderer: RendererType;
    _type: Node_Type;
    _draw_settings: Node_Draw_Settings;

    constructor(type: Node_Type, parent: Draw_Node, draw_settings: Node_Draw_Settings) {
        this._Renderer = this._parent?._Renderer;
        this._type = type;
        this._parent = parent;
        this._draw_settings = draw_settings;
        return this;
    }

    //Set local spatial transform
    transform(trans: Transform) {
        this._local_transform  = trans;
    }

    //Convenience transform aliases
    scale(x: number, y: number) {
        console.log(x, y)
    }

    rotate(angle: number, units: "deg" | "rad" = "deg") {
        console.log(angle, units)
    }

    translate(x: number, y: number) {
        this._local_transform[0][2] = x;
        this._local_transform[1][2] = y;
    }

    skew(x: number, y: number) {
        console.log(x, y)
    }

    mirror(axis: "x" | "y") {
        console.log(axis)
    }

    //Paint settings
    set_paint(draw_settings: Partial<Node_Draw_Settings>) {
        this._draw_settings = {...this._draw_settings, ...draw_settings};
    }

    //Apply parent transformations and render
    #apply_parent_transformation_history(): Transform {
        if(!this._ancestry) {
            let parent = this._parent;
            while(parent) {
                this._ancestry.push(parent);
                parent = parent._parent;
            }
            this._ancestry.reverse();
        }

        let combined_transform: Transform = this._local_transform;
        for(let ancestor of this._ancestry) {
            combined_transform = matrix_multiply(ancestor._local_transform, combined_transform);
        }
        
        return combined_transform;
    }

    _render() {
        let combined_transform = this.#apply_parent_transformation_history();
        this._Renderer._draw(this._type, this._draw_settings, combined_transform);
    }
}