import {Request, Response} from "express";
import {TrainPointModel} from "../models/train_point";


export namespace TrainController {

    export async function getTrains(req: Request, res: Response) {
        let trains = await TrainPointModel.find({}).select("_id line_id position velocity"); // TODO add visible true or user's train_id is equal
        return res.send({success: true, data: trains});
    }
}