import * as mongoose from 'mongoose';

const locationUpdateSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.Number,
    },
    longitude: {
        type: mongoose.Schema.Types.Number,
    },
    latitude: {
        type: mongoose.Schema.Types.Number,
    },
    date: {
        type: mongoose.Schema.Types.Number
    },
    accuracy: {
        type: mongoose.Schema.Types.Number
    },
    speed: {
        type: mongoose.Schema.Types.Number
    },
    speed_accuracy: {
        type: mongoose.Schema.Types.Number
    },
});
export const LocationUpdate = mongoose.model('location_updates', locationUpdateSchema);
