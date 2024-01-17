import Palette from "../main";
import { sort_nodes, width_height_from_dimensions } from "./util";
import { Dimensions, Node_Type, TypeBasedDimensions } from "../types/drawNode";
import { Transform } from "../types/transforms";
import { Godlike, Node_Draw_Settings } from "../types/general";

type Coords = {x?: number, y?: number};

export default class Draw_Node<T extends Node_Type> implements Godlike {
    _root: Palette;
    _dimensions: Dimensions;
    #transforms: {
        scale: [number, number],
        rotation: number,
        translation: [number, number],
        skew: [number, number],
        mirror: "x" | "y" | "xy" | "none",
        origin: [number, number],
        mask?: Transform
    }
    _local_transform: Transform;
    _parent: Draw_Node<T>;
    _ancestry: Draw_Node<T>[];
    _ancestry_index: number = 0;
    _z_index: number = 0;
    _children?: Draw_Node<T>[];
    _type: Node_Type;
    _draw_settings: Node_Draw_Settings;

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
            origin: [0, 0],
        }
        this.transform_origin("center");
        this._local_transform = [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ];
        this.#determine_ancestry();
    }

    //Set dimensions
    dimensions(dimensions?: Dimensions) {
        if(!dimensions) return this._dimensions;
        this._dimensions = {...this._dimensions, ...dimensions};
        return this;
    }

    transform_origin(origin?: Coords | "center") {
        if(!origin) return this.#transforms.origin;
        if(origin === "center") {
            let wh = width_height_from_dimensions(this._dimensions);
            this.#transforms.origin = [wh[0] / 2, wh[1] / 2];
        }
        else {
            this.#transforms.origin[0] = origin.x ?? this.#transforms.origin[0];
            this.#transforms.origin[1] = origin.y ?? this.#transforms.origin[1];
        }
        return this;
    }

    //Set local transform
    matrix(trans?: Transform) {
        if(!trans) return this._local_transform;
        this._local_transform  = trans;
        return this;
    }

    //Convenience transform aliases (multiplicative)
    scale(coords?: Coords) {
        if(!coords) return this.#transforms.scale;

        this.#transforms.scale = [
            coords.x ?? this.#transforms.scale[0], 
            coords.y ?? this.#transforms.scale[1]
        ];
        return this;
    }

    rotate(radians: number) {
        if(radians === undefined) return this.#transforms.rotation;
        this.#transforms.rotation = radians;
        return this;
    }

    rotateDeg(degrees: number) {
        if(degrees === undefined) return this.#transforms.rotation * 180 / Math.PI;
        this.#transforms.rotation = degrees * (Math.PI / 180);
        return this;
    }

    translate(coords?: Coords) {
        if(!coords) return this.#transforms.translation;
        this.#transforms.translation = [
            coords.x ?? this.#transforms.translation[0], 
            coords.y ?? this.#transforms.translation[1]
        ];
        return this;
    }

    skew(coords?: Coords) {
        if(!coords) return this.#transforms.skew;
        this.#transforms.skew = [
            coords.x ?? this.#transforms.skew[0], 
            coords.y ?? this.#transforms.skew[1]
        ];
        return this;
    }

    //Alias for skew
    shear(coords?: Coords) {
        return this.skew(coords);
    }

    mirror(axis: "x" | "y" | "xy" | "none") {
        if(axis === undefined) return this.#transforms.mirror;
        this.#transforms.mirror = axis;
        return this;
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
    // #apply_parent_transformation_history(): Transform {
    //     let combined_transform: Transform = this.#apply_transforms();
    //     for(let ancestor of this._ancestry) {
    //         combined_transform = matrix_multiply(ancestor._local_transform, combined_transform);
    //     }
        
    //     return combined_transform;
    // }

    //Create
    create<T extends Node_Type>(type: T, dimensions: TypeBasedDimensions<T>, draw_settings: Node_Draw_Settings) {
        let node = new Draw_Node<T>(this._root, type, this, dimensions, draw_settings);
        if(!this._children) this._children = [];
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
        // let combined_transform = this.#apply_parent_transformation_history();
        // //Account for transform origin
        // combined_transform = matrix_multiply([
        //     [1, 0, this._transform_origin[0]],
        //     [0, 1, this._transform_origin[1]],
        //     [0, 0, 1],
        // ], combined_transform);
        // let combined_transform = this.#apply_transforms();
        this._root._Renderer._draw(this._type, this._dimensions, [], this.#transforms, this._draw_settings);
    }
}