import {Request, Response} from "express";
import {TrainPointModel} from "../models/train_point";


export namespace TrainController {

    export async function getTrains(req: Request, res: Response) {
        let trains = await TrainPointModel.find({}).select("_id line_id position velocity timestamp"); // TODO add visible true or user's train_id is equal
        return res.send({success: true, data: trains});
    }

    export async function updateTrain(req: Request, res: Response) {
        let train = await TrainPointModel.findById(req.body.id);
        if (train) {
            train.name = req.body.name;
            await train.save();
        }
        return res.send({success: true});
    }
}