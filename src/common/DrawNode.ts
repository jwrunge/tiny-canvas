import Palette from "../main";
import { matrix_multiply, sort_nodes } from "./util";
import { Dimensions, Node_Type, TypeBasedDimensions } from "../types/drawNode";
import { Transform } from "../types/transforms";
import { Godlike, Renderer_Type, Node_Draw_Settings, Typed_Renderer } from "../types/general";

export default class Draw_Node<T extends Node_Type> implements Godlike {
    _root: Palette;
    _dimensions: Dimensions;
    _local_transform: Transform;
    _transform_mask: Transform;
    _parent: Draw_Node<T>;
    _ancestry: Draw_Node<T>[];
    _children?: Draw_Node<T>[];
    _Renderer: Typed_Renderer<Renderer_Type>;
    _type: Node_Type;
    _draw_settings: Node_Draw_Settings;
    _ancestry_index: number = 0;
    _z_index: number = 0;

    constructor(root: Palette, type: T, parent: Draw_Node<any> | null, draw_settings: Node_Draw_Settings) {
        this._root = root;
        this._Renderer = this._parent?._Renderer;
        this._type = type;
        this._parent = parent;
        this._draw_settings = draw_settings;
        this.#determine_ancestry();
    }

    //Set dimensions
    set_dimensions(dimensions: Dimensions) {
        this._dimensions = dimensions;
    }

    update_dimensions(dimensions: Partial<Dimensions>) {
        this._dimensions = {...this._dimensions, ...dimensions};
    }

    //Set local transform
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
    create<T extends Node_Type>(type: T, dimensions: TypeBasedDimensions<T>, draw_settings: Node_Draw_Settings) {
        let node = new Draw_Node<T>(this._root, type, null, draw_settings);
        this._children.push(node);
        sort_nodes(this._children);
        return node;
    }

    destroy(node?: Draw_Node<any>) {
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
        this._Renderer._draw(this._type, this._dimensions, combined_transform, this._draw_settings);
    }
}