import {Router} from "express";
import {LocationController} from "./controllers/location";

export namespace Routes {
    export function init(app: Router) {
        app.post('/api/public/location-update', LocationController.addNewUpdate);
    }
}
