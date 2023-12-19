type TransX = number;
type TransY = number;
type ScaleX = number;
type ScaleY = number;
type ShearX = number;
type ShearY = number;

export type Transform = [[ ScaleX, ShearX, TransX ],
                         [ ShearY, ScaleY, TransY ],
                         [ 0,      0,      1      ]];
