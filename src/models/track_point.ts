import {Document, model, Model, Schema} from "mongoose";


export interface TrackPoint extends Document {
    index: number;
    line_id: number;
    lat: number;
    lon: number;
    position: number;
}


const trackPointSchema = new Schema({
    _id: {
        type: Schema.Types.Number,
    },
    index: {
        type: Schema.Types.Number,
    },
    line_id: {
        type: Schema.Types.Number,
    },
    lat: {
        type: Schema.Types.Number,
    },
    lon: {
        type: Schema.Types.Number,
    },
    diff: {
        type: Schema.Types.Number
    },
    position: {
        type: Schema.Types.Number
    },
});

export const TrackPointModel: Model<TrackPoint> = model<TrackPoint>('track_point', trackPointSchema, 'track_points');