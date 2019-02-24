import {Document, model, Model, Schema} from "mongoose";


export interface TrainPoint extends Document {
    _id: number;
    line_id: number;
    position: number;
    velocity: number;
    acceleration: number;
    timestamp: number;
    visible: number;
    name: string;
}


const trainPointSchema = new Schema({
    _id: {
        type: Schema.Types.Number,
        required: true,
    },
    line_id: {
        type: Schema.Types.Number,
        required: true,
    },
    position: {
        type: Schema.Types.Number,
        required: true,
    },
    velocity: {
        type: Schema.Types.Number,
        required: true,
    },
    acceleration: {
        type: Schema.Types.Number,
        required: true,
    },
    timestamp: {
        type: Schema.Types.Number,
        required: true,
    },
    visible: {
        type: Schema.Types.Number,
        required: true,
    },
    name: {
        type: Schema.Types.String,
        required: false,
    },
});

export const TrainPointModel: Model<TrainPoint> = model<TrainPoint>('train_point', trainPointSchema, 'train_points');
