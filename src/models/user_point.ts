import {Document, model, Model, Schema} from "mongoose";


export interface UserPoint extends Document {
    _id: number;
    line_id: number;
    lon: number;
    lat: number;
    position: number;
    velocity: number;
    acceleration: number;
    timestamp: number;
    train_id: number;
    continuation: number;
}


const userPointSchema = new Schema({
    _id: {
        type: Schema.Types.Number,
        required: true,
    },
    line_id: {
        type: Schema.Types.Number,
        required: true,
    },
    lon: {
        type: Schema.Types.Number,
        required: true,
    },
    lat: {
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
    train_id: {
        type: Schema.Types.Number,
        required: true,
    },
    continuation: {
        type: Schema.Types.Number,
        required: true,
    },
});

export const UserPointModel: Model<UserPoint> = model<UserPoint>('user_point', userPointSchema, 'user_points');
