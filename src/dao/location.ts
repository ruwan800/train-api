import {UserPoint, UserPointModel} from "../models/user_point";
import {TrainPoint, TrainPointModel} from "../models/train_point";
import {Location} from "../util/location";
import {TrackPoint, TrackPointModel} from "../models/track_point";
import {appLogger} from "../util/logging";


export namespace LocationDao {

    const MAX_TRACK_POINT_NEARBY_DISTANCE = 0.8; // 400m
    const MAX_TRAIN_NEARBY_DISTANCE = 1; // 1000m

    export async function getClosestTwoPoints(point: Location.Point): Promise<TrackPoint[]> {
        const [minP, maxP] = Location.getDistantPoints(point, MAX_TRACK_POINT_NEARBY_DISTANCE);
        const conditions = {lon: {$gt: minP.lon, $lt: maxP.lon}, lat: {$gt: minP.lat, $lt: maxP.lat}};
        let points = await TrackPointModel.find(conditions);
        if (2 < points.length) {
            points = points.sort((a, b) => {
                const distA = Location.getDistance(a, point);
                const distB = Location.getDistance(b, point);
                return distA === distB ? 0 : distA < distB ? -1 : 1;
            });
        }
        // appLogger.info("\n___________________________  POINTS  _____________________________________\n");
        // appLogger.info(JSON.stringify(points));
        // appLogger.info("\n\n");
        return points.slice(0, 2);
    }

    export async function getPreviousUserPoint(id: number): Promise<UserPoint | null> {
        return await UserPointModel.findById(id);
    }

    export async function getNearbyTrains(userPoint: UserPoint): Promise<TrainPoint[]> {
        const maxD = MAX_TRAIN_NEARBY_DISTANCE;
        const pos = userPoint.position;
        const speedCond = 0 < userPoint.velocity ? {$gt: 0} : {$lt: 0};
        const conditions = {position: {$gt: pos - maxD, $lt: pos + maxD}, line_id: userPoint.line_id, velocity: speedCond};
        return await TrainPointModel.find(conditions);
    }

    export async function findUsersForTrain(train_id: number, since: number): Promise<UserPoint[]> {
        const conditions = {timestamp: {$gt: since}, train_id: train_id};
        return await UserPointModel.find(conditions);
    }

    export async function findNewActiveUserPoints(): Promise<UserPoint[]> {
        const conditions = {continuation: {$gt: 2}, train_id: 0, velocity: {$not: {$gt: -4, $lt: 4}}};
        return await UserPointModel.find(conditions);
    }
}