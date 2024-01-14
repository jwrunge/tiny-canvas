import Palette from "../main";
import { matrix_add, matrix_multiply, matrix_subtract, sort_nodes } from "./util";
import { Dimensions, Node_Type, TypeBasedDimensions } from "../types/drawNode";
import { Transform } from "../types/transforms";
import { Godlike, Node_Draw_Settings } from "../types/general";

export default class Draw_Node<T extends Node_Type> implements Godlike {
    _root: Palette;
    _dimensions: Dimensions;
    #transforms: {
        scale: [number, number],
        rotation: number,
        translation: [number, number],
        skew: [number, number],
        mirror: "x" | "y" | "xy" | "none"
    }
    _local_transform: Transform;
    _transform_mask: Transform;
    _parent: Draw_Node<T>;
    _ancestry: Draw_Node<T>[];
    _ancestry_index: number = 0;
    _z_index: number = 0;
    _children?: Draw_Node<T>[];
    _type: Node_Type;
    _draw_settings: Node_Draw_Settings;
    _transform_origin: [number, number] = [0, 0];

    constructor(root: Palette, type: T, parent: Draw_Node<any> | null, dimensions: TypeBasedDimensions<T>, draw_settings: Node_Draw_Settings) {
        this._root = root;
        this._type = type;
        this._parent = parent;
        this._draw_settings = draw_settings;
        this._dimensions = dimensions;
        this.#transforms = {
            scale: [1, 1],
            rotation: 0,
            translation: [0, 0],
            skew: [0, 0],
            mirror: "none",
        }
        this._local_transform = [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ];
        this.#determine_ancestry();
    }

    //Set dimensions
    dimensions(dimensions?: Dimensions) {
        if(!dimensions) return this._dimensions;
        this._dimensions = {...this._dimensions, ...dimensions};
        return this;
    }

    transform_origin(x?: number, y?: number) {
        if(x === undefined || y === undefined) return this._transform_origin;
        this._transform_origin = [x, y];
        return this;
    }

    //Set local transform
    matrix(trans?: Transform) {
        if(!trans) return this._local_transform;
        this._local_transform  = trans;
        return this;
    }

    //Convenience transform aliases (multiplicative)
    scale(x?: number, y?: number) {
        if(x === undefined || y === undefined) return this.#transforms.scale;

        this.#transforms.scale = [x, y];
        return this;
    }

    rotate(angle: number, units: "deg" | "rad" = "deg") {
        if(angle === undefined) return this.#transforms.rotation;
        if(units === "deg") angle = angle * Math.PI / 180;
        this.#transforms.rotation = angle;
        return this;
    }

    translate(x: number, y: number) {
        if(x === undefined || y === undefined) return this.#transforms.translation;
        this.#transforms.translation = [x, y];
        return this;
    }

    skew(x: number, y: number) {
        if(x === undefined || y === undefined) return this.#transforms.skew;
        this.#transforms.skew = [x, y];
        return this;
    }

    //Alias for skew
    shear(x?: number, y?: number) {
        return this.skew(x, y);
    }

    mirror(axis: "x" | "y" | "xy" | "none") {
        if(axis === undefined) return this.#transforms.mirror;
        this.#transforms.mirror = axis;
        return this;
    }

    #apply_transforms() {
        const mirror_x = this.#transforms.mirror === "x" || this.#transforms.mirror === "xy" ? -1 : 1;
        const mirror_y = this.#transforms.mirror === "y" || this.#transforms.mirror === "xy" ? -1 : 1;

        let t: Transform = [
            [this.#transforms.scale[0] * mirror_x,  this.#transforms.skew[0],               0],
            [this.#transforms.skew[1],              this.#transforms.scale[1] * mirror_y,   0],
            [0,                                     0,                                      1],
        ];

        const rotationMatrix: Transform = [
            [Math.cos(this.#transforms.rotation), -Math.sin(this.#transforms.rotation), 0],
            [Math.sin(this.#transforms.rotation), Math.cos(this.#transforms.rotation), 0],
            [0, 0, 1],
        ];
        
        t = matrix_multiply(t, rotationMatrix);
        this._local_transform = t;
        return t;
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
        let combined_transform: Transform = this.#apply_transforms();
        for(let ancestor of this._ancestry) {
            combined_transform = matrix_multiply(ancestor._local_transform, combined_transform);
        }
        
        return combined_transform;
    }

    //Create
    create<T extends Node_Type>(type: T, dimensions: TypeBasedDimensions<T>, draw_settings: Node_Draw_Settings) {
        let node = new Draw_Node<T>(this._root, type, this, dimensions, draw_settings);
        if(!this._children) this._children = [];
        this._children.push(node);
        sort_nodes(this._children);
        console.log("NEW CHILD", node)
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
        //Account for transform origin
        combined_transform = matrix_multiply([
            [1, 0, this._transform_origin[0]],
            [0, 1, this._transform_origin[1]],
            [0, 0, 1],
        ], combined_transform);
        this._root._Renderer._draw(this._type, this._dimensions, combined_transform, this._draw_settings);
    }
}