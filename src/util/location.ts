import {TrackPoint, TrackPointModel} from "../models/track_point";
import {UserPoint} from "../models/user_point";
import {appLogger} from "./logging";

export namespace Location {

    const EQUATOR_RADIUS = 6378;
    const POLAR_RADIUS = 6378;

    export interface Point {
        lon: number;
        lat: number;
    }

    export interface PH {
        position: number;
        height: number;
        line_id: number;
    }

    export interface PVA {
        position: number;
        velocity: number;
        acceleration: number;
    }

    export function getDistance(location1: Point, location2: Point): number {
        const lon_d = (Math.abs(location2.lon - location1.lon)) * (EQUATOR_RADIUS * 2 * Math.PI / 360);
        const lat_d = (Math.abs(location2.lat - location1.lat)) * (POLAR_RADIUS * 2 * Math.PI / 360);
        return Math.sqrt(Math.pow(lat_d, 2) + Math.pow(lon_d, 2));
    }

    export function getDistantPoints(location: Point, distance: number): Point[] {
        new TrackPointModel();
        const t_lon = distance * 360 / (EQUATOR_RADIUS * 2 * Math.PI);
        const t_lat = distance * 360 / (POLAR_RADIUS * 2 * Math.PI);
        return [{lon: location.lon - t_lon, lat: location.lat - t_lat},
            {lon: location.lon + t_lon, lat: location.lat + t_lat}];
    }

    export function getPH(p0: Point, p1: TrackPoint, p2: TrackPoint): PH {
        if (p2.position < p1.position) {
            const temp = p2;
            p2 = p1;
            p1 = temp;
        }
        const p01 = getDistance(p0, p1);
        const p02 = getDistance(p0, p2);
        const p12 = getDistance(p1, p2);

        const cos012 = (Math.pow(p01, 2) + Math.pow(p12, 2) - Math.pow(p02, 2)) / (2 * p01 * p12);
        const theta012 = Math.acos(cos012);
        const sin012 = Math.sin(theta012);
        const d = cos012 * p01;
        const h = sin012 * p01;

        // appLogger.info("\n______________________DH______________________________");
        // appLogger.info(`p0: ${JSON.stringify(p0)}`);
        // appLogger.info(`p1: ${p1}`);
        // appLogger.info(`p2: ${p2}`);
        // appLogger.info(`position: ${p1.position}`);
        // appLogger.info(`cos012: ${cos012}`);
        // appLogger.info(`sin012: ${sin012}`);
        // appLogger.info(`d: ${d}`);
        // appLogger.info(`h: ${h}`);
        // appLogger.info(`pos: ${p1.position + d}`);
        // appLogger.info("\n\n");
        return {position: p1.position + d, height: h, line_id: p1.line_id};
    }

    export function getPVA(userPoint: UserPoint, previousUserPoint: UserPoint): PVA {
        const distance = userPoint.position - previousUserPoint.position; // in kilometers
        const duration = userPoint.timestamp - previousUserPoint.timestamp; // in milliseconds
        const vMean = duration === 0 ? 0 : (distance * 1000) / (duration / 1000);
        // const v = (2 * vMean) - previousUserPoint.velocity;
        // const a = distance === 0 ? 0 : 2 * (vMean - previousUserPoint.velocity) / distance;

        // appLogger.info("\n_________________________________________________________");
        // appLogger.info(`p1:${JSON.stringify(userPoint)}`);
        // appLogger.info(`p2:${JSON.stringify(previousUserPoint)}`);
        // appLogger.info(`distance:${distance}`);
        // appLogger.info(`duration:${duration}`);
        // appLogger.info(`vMean:${vMean}`);
        // appLogger.info(`v:${v}`);
        // appLogger.info(`a:${a}`);
        // appLogger.info("\n");
        return {position: userPoint.position, velocity: vMean, acceleration: 0};
    }

    export function getUpdatedPVA(userPoint: UserPoint, time: number): PVA {
        const up = userPoint;
        const timeS = (time - userPoint.timestamp) / 1000;
        const newP = up.position + ((up.velocity * timeS) / 1000); // + (up.acceleration * Math.pow(timeS, 2) / 2);
        // const newV = up.velocity + (up.acceleration * timeS);
        // appLogger.info(`getUpdated PVA up.pos: ${up.position}, up.vel: ${up.velocity}, times: ${timeS}, newP: ${newP}`);
        return {position: newP, velocity: up.velocity, acceleration: 0};
    }

}