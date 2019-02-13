import {TrackPoint, TrackPointModel} from "../models/track_point";
import {UserPoint} from "../models/user_point";
import {appLogger} from "./logging";

export namespace Location {

    const EQUATOR_RADIUS = 6378;
    const POLAR_RADIUS = 6378;

    export interface Point {
        lat: number;
        lon: number;
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
        const lat_d = (Math.abs(location2.lat - location1.lat)) * (EQUATOR_RADIUS * 2 * Math.PI / 360);
        const lon_d = (Math.abs(location2.lon - location1.lon)) * (POLAR_RADIUS * 2 * Math.PI / 360);
        return Math.sqrt(Math.pow(lon_d, 2) + Math.pow(lat_d, 2));
    }

    export function getDistantPoints(location: Point, distance: number): Point[] {
        new TrackPointModel();
        const t_lat = distance * 360 / (EQUATOR_RADIUS * 2 * Math.PI);
        const t_lon = distance * 360 / (POLAR_RADIUS * 2 * Math.PI);
        return [{lat: location.lat - t_lat, lon: location.lon - t_lon},
            {lat: location.lat + t_lat, lon: location.lon + t_lon}];
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
        const p1x = (p01 * p12) / (p02 + p01);
        const h = Math.sqrt((p01 ** 2) - (p1x ** 2));
        const pos = p1.position < p2.position ? p1.position : p2.position;
        // appLogger.info("\n______________________DH______________________________");
        // appLogger.info(`p0: ${JSON.stringify(p0)}`);
        // appLogger.info(`p1: ${p1}`);
        // appLogger.info(`p2: ${p2}`);
        // appLogger.info(`position: ${pos}`);
        // appLogger.info(`pos + p1x: ${pos + p1x}`);
        // appLogger.info(`h: ${h}`);
        // appLogger.info(`p01: ${p01}`);
        // appLogger.info(`p02: ${p02}`);
        // appLogger.info(`p12: ${p12}`);
        // appLogger.info(`p1x: ${p1x}`);
        // appLogger.info("\n\n");
        return {position: pos + p1x, height: h, line_id: p1.line_id};
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