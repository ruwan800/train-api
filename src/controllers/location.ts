import {NextFunction, Request, Response} from "express";
import {LocationUpdate} from "../models/location_update";

export namespace LocationController {

    export function addNewContact(req: Request, res: Response, next: NextFunction) {
        console.log("PPPP0");
        let locationUpdate = new LocationUpdate(req.body);
        console.log("PPPP1");
        // return locationUpdate.save((err, entry) => {
        //     console.log("PPPP2");
        //     console.log(err);
        //     console.log(entry);
        //     if (err) {
        //         res.send(err);
        //     } else {
        //         res.json(entry);
        //     }
        // });
        res.send({success: true});
        //next()
    }
}
