import {assert} from 'chai'
import {Location} from "../../src/util/location";
import {TrackPoint, TrackPointModel} from "../../src/models/track_point";

describe('Location', () => {
    // before(async () => {
    //     user = await dummyUser()
    //     progress = await dummyProgress()
    //     offer = await dummyOffer()
    // })

    it('#getDistance', async () => {

        const point0: Location.Point  =  {lon: 79.875875, lat: 6.785618};
        const point1: Location.Point  =  {lon: 79.875806, lat: 6.785805};
        const point2: Location.Point  =  {lon: 79.875135, lat: 6.787889};
        const p01 = await Location.getDistance(point0, point1);
        const p02 = await Location.getDistance(point0, point2);
        const p12 = await Location.getDistance(point1, point2);
        console.log(p01);
        console.log(p02);
        console.log(p12);
        const tp1 = await TrackPointModel.findById(61);
        const tp2 = await TrackPointModel.findById(60);

        console.log("PPPPPPPPPPPPPPPPPP");
        console.log(Location.getPH(point0, tp1!, tp2!));
        console.log(Location.getPH2(point0, tp1!, tp2!));
        assert.isNotNull(p01);
        assert.isNotNull(p02);
        assert.isNotNull(p12);
    })
});