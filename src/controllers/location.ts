import {Request, Response} from "express";
// import {LocationUpdate} from "../models/location_update";
import {appLogger} from "../util/logging";
import {Location} from "../util/location";
import {TrackPoint} from "../models/track_point";
import {UserPoint, UserPointModel} from "../models/user_point";
import {LocationDao} from "../dao/location";

export namespace LocationController {

    const MAX_AWAY_DISTANCE_FROM_TRACK = 0.1; // 100m

    export async function addNewUpdate(req: Request, res: Response) { // send user id as user_id

        try {
            // let locationUpdate = new LocationUpdate(req.body);
            // const saved1 = await locationUpdate.save();
            const previousUserPoint = await LocationDao.getPreviousUserPoint(req.body.user_id);
            appLogger.info("previousUserPoint", previousUserPoint != null);
            if (req.body.velocity === 0 && (!previousUserPoint || previousUserPoint.train_id === 0)) {
                appLogger.info("low velocity");
                return res.send({success: false, message: "not moving"});
            }
            const point: Location.Point = {lat: req.body.lat, lon: req.body.lon};
            appLogger.info("point created", point);
            const closest: TrackPoint[] = await LocationDao.getClosestTwoPoints(point);
            if (closest.length < 2) {
                appLogger.info("found less than 2 closest points");
                return res.send({success: false, message: "found less than 2 closest points"});
            }
            appLogger.info("closest points found");
            const dh = Location.getPH(point, closest[0]!, closest[1]!);
            appLogger.info(`D: ${dh.position}, H: ${dh.height}`);
            if (MAX_AWAY_DISTANCE_FROM_TRACK < dh.height) {
                return res.send({success: false, message: `little far away from rail track - p:${dh.position}, h:${dh.height}`});
            }
            appLogger.info("near rail track");
            const userPoint = previousUserPoint ? new UserPointModel(previousUserPoint) : new UserPointModel();

            userPoint.position = dh.position;
            userPoint.line_id = dh.line_id;
            userPoint.lat = req.body.lat;
            userPoint.lon = req.body.lon;
            userPoint._id = req.body.user_id;
            userPoint.timestamp = req.body.timestamp;

            if (previousUserPoint && previousUserPoint!.line_id === userPoint.line_id) {
                const va = Location.getPVA(userPoint, previousUserPoint);
                userPoint.velocity = va.velocity;
                userPoint.acceleration = 0; // va.acceleration;
                appLogger.info("USER  PVA p:" + userPoint.position + ",V:" + userPoint.velocity + ",A:" + userPoint.acceleration);
            } else {
                userPoint.velocity = 0;
                userPoint.acceleration = 0;
            }

            const nearbyTrains = await LocationDao.getNearbyTrains(userPoint);
            appLogger.info("nearby trains:" + nearbyTrains.length);
            if (0 < nearbyTrains.length) {
                const sameTrain = nearbyTrains.find((trainPoint) => {
                    return trainPoint._id === userPoint.train_id;
                });
                if (sameTrain) {
                    userPoint.train_id = sameTrain._id;
                    userPoint.continuation = previousUserPoint ? previousUserPoint.continuation + 1 : 0;
                } else {
                    const closestTrain = nearbyTrains.reduce((a, b) => {
                        return Math.abs(userPoint.position - a.position) < Math.abs(userPoint.position - b.position) ? a : b;
                    });
                    userPoint.train_id = closestTrain._id;
                    userPoint.continuation = 0;
                }
            } else {
                userPoint.train_id = 0;
                userPoint.continuation = previousUserPoint ? previousUserPoint.train_id !== 0 ? 0 : previousUserPoint.continuation + 1 : 0;
            }
            // appLogger.info("saving user point"+ userPoint);
            await userPoint.save();

            const msg = previousUserPoint ? getMessage(userPoint, previousUserPoint) : `initial entry - p:${userPoint.position}, v:${userPoint.velocity}`;

            return res.send({success: true, message: msg});
        } catch (e) {
            appLogger.error("Error location update:", e);
            return res.send({success: false, message: e.toString()});
        }
    }


    function getMessage(userPoint: UserPoint, previousUserPoint: UserPoint) {
        if (0 < userPoint.train_id) {
            if (previousUserPoint.train_id === 0) {
                return `new train created with id:${userPoint.train_id}, p:${userPoint.position}, v${userPoint.velocity}`;
            } else if (userPoint.train_id !== previousUserPoint.train_id) {
                return `train changed to id:${userPoint.train_id}, p:${userPoint.position}, v${userPoint.velocity}`;
            } else {
                return `train id:${userPoint.train_id}, p:${userPoint.position}, v${userPoint.velocity}`;
            }
        } else {
            return `continuation count:${userPoint.continuation}, p:${userPoint.position}, v${userPoint.velocity}`;
        }
    }
}
