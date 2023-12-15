import { Node_Draw_Settings, Node_Type, Transform, Vector2 } from "./typesAndDefaults";
import Draw_Node from "./DrawNode";
import { matrix_multiply } from "./util";

export default class Draw_Node_Type extends Draw_Node {
    _type: Node_Type;
    _draw_settings: Node_Draw_Settings;

    constructor(type: Node_Type, parent: Draw_Node, draw_settings: Node_Draw_Settings) { 
        super();
        this._type = type;
        this._parent = parent;
        this._draw_settings = draw_settings;

        return this;
    }

    set_paint(draw_settings: Partial<Node_Draw_Settings>) {
        this._draw_settings = {...this._draw_settings, ...draw_settings};
    }

    #apply_parent_transformation_history() {
        let node = this;

        let position: Vector2;
        let transformation: Transform;
        while(node._parent) {
            if(!position) position = node._parent._spatial.position;
            else position = [position[0] + node._parent._spatial.position[0], position[1] + node._parent._spatial.position[1]];

            if(!transformation) transformation = node._parent._spatial.transform;
            else transformation = matrix_multiply(transformation, node._parent._spatial.transform);
        }

        this.set_spatial({position, transform: transformation})
    }

    _render() {
        this.#apply_parent_transformation_history();
        this._Renderer._draw(this._type, this._draw_settings, this._spatial);
    }
}