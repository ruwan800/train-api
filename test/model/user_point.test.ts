import {assert} from 'chai'
import {LocationDao} from '../../src/dao/location'
import {UserPointModel} from "../../src/models/user_point";

describe('LocationDao', () => {
    // before(async () => {
    //     user = await dummyUser()
    //     progress = await dummyProgress()
    //     offer = await dummyOffer()
    // })

    it('#createUserPoint()', async () => {

        const id= new Date().getTime();

        const up1 = new UserPointModel();
        up1._id = id;
        up1.position = 12;
        up1.acceleration = 0;
        up1.velocity = 0;
        up1.train_id = 0;
        up1.line_id = 1;
        up1.lat = 80.4;
        up1.lon = 7.4;
        up1.continuation = 0;
        up1.timestamp = new Date().getTime();

        const saved1 = await up1.save();

        const copy = new UserPointModel(saved1);

        //console.log(saved1);
        copy.continuation = 4;
        //await UserPointModel.update({_id: copy._id}, copy);
        const saved2 = await copy.save();
        //console.log(saved2);

        assert.isNotNull(saved1);
        assert.isNotNull(saved2);
    })
});