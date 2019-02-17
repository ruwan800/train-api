import {Request, Response} from "express";
import {StationModel} from "../models/station";


export namespace StationController {

    export async function getStations(req: Request, res: Response) {
        let stations = await StationModel.find().select("_id line_id position name");
        return res.send({success: true, data: stations});
    }
}