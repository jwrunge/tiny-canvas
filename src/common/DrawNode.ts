import Palette from "../main";
import { Dimensions, Godlike, Node_Draw_Settings, Node_Type, RendererType, Transform } from "./typesAndDefaults";
import { matrix_multiply, sort_nodes } from "./util";

export default class Draw_Node implements Godlike {
    _root: Palette;
    _dimensions: Dimensions;
    _local_transform: Transform;
    _transform_mask: Transform;
    _parent: Draw_Node;
    _ancestry: Draw_Node[];
    _children?: Draw_Node[];
    _Renderer: RendererType;
    _type: Node_Type;
    _draw_settings: Node_Draw_Settings;
    _ancestry_index: number = 0;
    _z_index: number = 0;

    constructor(root: Palette, type: Node_Type, parent: Draw_Node, draw_settings: Node_Draw_Settings) {
        this._root = root;
        this._Renderer = this._parent?._Renderer;
        this._type = type;
        this._parent = parent;
        this._draw_settings = draw_settings;
        this.#determine_ancestry();
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

    //Determine ancestry
    #determine_ancestry() {
        this._ancestry = [];
        let ancestor = this._parent;
        while(ancestor instanceof Draw_Node) {
            this._ancestry.push(ancestor);
            ancestor = ancestor._parent;
        }
        this._ancestry.reverse();
        this._ancestry_index = this._ancestry.length * 100_000;
    }

    //Apply parent transformations and render
    #apply_parent_transformation_history(): Transform {
        let combined_transform: Transform = this._local_transform;
        for(let ancestor of this._ancestry) {
            combined_transform = matrix_multiply(ancestor._local_transform, combined_transform);
        }
        
        return combined_transform;
    }

    //Create
    create(type: Node_Type, draw_settings: Node_Draw_Settings) {
        let node = new Draw_Node(this._root, type, null, draw_settings);
        this._children.push(node);
        sort_nodes(this._children);
        return node;
    }

    destroy(node?: Draw_Node) {
        if(!node) node = this;
        else {
            let index = this._children.indexOf(node);
            if(index > -1) this._children.splice(index, 1);
        }

        for(let i = 0; i < node._children?.length; i++) {
            this.destroy(node._children[i]);
        }

        this._root._remove_node(node);
        node = null;
    }

    //Render
    _render() {
        let combined_transform = this.#apply_parent_transformation_history();
        this._Renderer._draw(this._type, combined_transform, this._draw_settings);
    }
}