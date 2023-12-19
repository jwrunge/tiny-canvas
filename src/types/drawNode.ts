//Node types
export type Ellipse = "Ellipse";
export type Triangle = "Triangle";
export type Rectangle = "Rectangle";
export type Star = "Star";
export type Path = "Path";
export type Text = "Text";
export type Image = "Image";
export type Sprite = "Sprite";

export type Node_Type = Ellipse | Triangle | Rectangle | Star | Path | Text | Image | Sprite;

//Node dimension definitions
export interface CircularDimensions {
    radius: number
}
export interface EllipseDimensions {
    radius_x: number,
    radius_y: number
}
export interface RectangleDimensions {
    width: number,
    height: number
}
export interface StarDimensions {
    radius: number,
    points: number
}
export interface TriangleDimensions {
    base: number,
    height: number
}

export type Dimensions = CircularDimensions | EllipseDimensions | RectangleDimensions | StarDimensions | TriangleDimensions;

//Type-based dimension definitions
export type TypeBasedDimensions<T> = T extends Ellipse ? CircularDimensions | EllipseDimensions : 
    T extends Triangle ? TriangleDimensions :
    T extends Rectangle ? RectangleDimensions :
    T extends Star ? StarDimensions :
    T extends Path ? RectangleDimensions :
    T extends Text ? RectangleDimensions :
    T extends Image ? RectangleDimensions :
    T extends Sprite ? RectangleDimensions :
    Dimensions