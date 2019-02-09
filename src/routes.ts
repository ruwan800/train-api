import {Express, Router} from "express";
import {LocationController} from "./controllers/location";

export namespace Routes {
    export function init(app: Router) {
        app.get('/api/public/location-update', LocationController.addNewContact);
    }
}