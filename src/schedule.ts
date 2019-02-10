import {dbConnect} from "./util/db_connect";
import {TrainPoint, TrainPointModel} from "./models/train_point";
import {UserPointModel} from "./models/user_point";
import {appLogger} from "./util/logging";
import {LocationDao} from "./dao/location";
import {Location} from "./util/location";



class Schedule {

    static async execute() {
        await dbConnect();
        const timestamp = new Date().getTime();
        //appLogger.info("starting schedule at " + timestamp);
        await Schedule.updateExistingTrains(timestamp);
        await Schedule.createNewTrains(timestamp);
        await Schedule.deleteOldUserPoints(timestamp);
    }

    private static async updateExistingTrains(timestamp: number) {
        //appLogger.info("updateExistingTrains");
        const trains: TrainPoint[] = await TrainPointModel.find();

        for (let train of trains) {
            if (train.visible === 0) {
                const trainUserPoints = await LocationDao.findUsersForTrain(train._id, timestamp - (20 * 1000));
                if (5 <= trainUserPoints.length) {
                    train.visible = 0;
                    appLogger.info("make train visible for id:" + train._id);
                    await train.save();
                }
            } else {
                const trainUserPoints = await LocationDao.findUsersForTrain(train._id, timestamp - (5 * 1000));
                if (0 < trainUserPoints.length) {
                    const dvas = trainUserPoints.map((p) => {
                        return Location.getUpdatedPVA(p, timestamp);
                    });
                    const newP = Schedule.getMeanPosition(dvas);
                    const newV = Schedule.getMeanVelocity(dvas);
                    const newA = Schedule.getMeanAcceleration(dvas);
                    train.position = newP;
                    train.velocity = newV;
                    train.acceleration = newA;
                    await train.save();
                }
            }
            const trainUserPoints = await LocationDao.findUsersForTrain(train._id, timestamp - (80 * 1000));
            if (trainUserPoints.length == 0) {
                appLogger.info("delete train for id:" + train._id);
                await TrainPointModel.findByIdAndDelete(train._id);
            }
        }
    }

    private static async createNewTrains(timestamp: number) {
        //appLogger.info("createNewTrains");
        const userPoints = await LocationDao.findNewActiveUserPoints();
        let uniqueTrainId = Math.floor(timestamp / 1000);
        if(0 < userPoints.length) {
            const point = userPoints[0];
            point.train_id = uniqueTrainId;
            // noinspection JSIgnoredPromiseFromCall
            await point.save();

            const trainPoint = new TrainPointModel();
            trainPoint._id = uniqueTrainId;
            trainPoint.visible = 0;
            trainPoint.line_id = point.line_id;
            trainPoint.timestamp = timestamp;

            const pva = Location.getUpdatedPVA(point, timestamp);
            trainPoint.velocity = pva.velocity;
            trainPoint.acceleration = pva.acceleration;
            trainPoint.position = pva.position;
            appLogger.info("createNewTrains for id:" + trainPoint._id);
            await trainPoint.save();

            uniqueTrainId += 1;
        }
    }

    private static async deleteOldUserPoints(timestamp: number) {
        //appLogger.info("deleteOldUserPoints");
        const timeBefore80secs = timestamp - (80 * 1000);
        await UserPointModel.deleteMany({timestamp: {$lt: timeBefore80secs}})
    }

    private static getMeanPosition(dvas: Location.PVA[]) {
        return dvas.reduce((carry, current) => {
            return carry + current.position
        }, 0) / dvas.length
    }

    private static getMeanVelocity(dvas: Location.PVA[]) {
        return dvas.reduce((carry, current) => {
            return carry + current.velocity
        }, 0) / dvas.length
    }

    private static getMeanAcceleration(dvas: Location.PVA[]) {
        return dvas.reduce((carry, current) => {
            return carry + current.acceleration
        }, 0) / dvas.length
    }
}

Schedule.execute().then(() => {
    //appLogger.info("Executed schedule");
    process.exit(1);
}).catch((e) => {
    appLogger.error(e);
    process.exit(1);
});