import {Router} from "express";
import {LocationController} from "./controllers/location";
import {TrainController} from "./controllers/train";
import {StationController} from "./controllers/station";

export namespace Routes {
    export function init(app: Router) {
        app.post('/api/public/location-update', LocationController.addNewUpdate);
        app.get('/api/public/trains', TrainController.getTrains);
        app.get('/api/public/stations', StationController.getStations);
    }
}
