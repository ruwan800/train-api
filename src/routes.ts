import {Router} from "express";
import {LocationController} from "./controllers/location";
import {TrainController} from "./controllers/train";

export namespace Routes {
    export function init(app: Router) {
        app.post('/api/public/location-update', LocationController.addNewUpdate);
        app.get('/api/public/trains', TrainController.getTrains);
    }
}
