import * as mongoose from 'mongoose';

const locationUpdateSchema = new mongoose.Schema({
    lon: {
        type: mongoose.Schema.Types.Number,
    },
    lat: {
        type: mongoose.Schema.Types.Number,
    },
    timestamp: {
        type: mongoose.Schema.Types.Number
    },
    velocity: {
        type: mongoose.Schema.Types.Number
    },
});
export const LocationUpdate = mongoose.model('location_updates', locationUpdateSchema);
