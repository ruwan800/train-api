import {assert} from 'chai'
import {LocationDao} from '../../src/dao/location'
import {Location} from "../../src/util/location";

describe('LocationDao', () => {
    // before(async () => {
    //     user = await dummyUser()
    //     progress = await dummyProgress()
    //     offer = await dummyOffer()
    // })

    it('#getClosestTwoPoints()', async () => {

        const point: Location.Point  =  {lon: 79.8474075, lat: 6.9284056};
        const items = await LocationDao.getClosestTwoPoints(point);
        assert.isNotNull(items[0]);
        assert.isNotNull(items[1]);
    })
});