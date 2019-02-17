import {Document, model, Model, Schema} from "mongoose";


export interface Station extends Document {
    _id: number;
    line_id: number;
    position: number;
    name: string;
    lat: number;
    lon: number;
}


const stationSchema = new Schema({
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
    name: {
        type: Schema.Types.String,
        required: true,
    },
    lat: {
        type: Schema.Types.Number,
        required: true,
    },
    lon: {
        type: Schema.Types.Number,
        required: true,
    }
});

export const StationModel: Model<Station> = model<Station>('station', stationSchema, 'stations');
