import * as mongoose from "mongoose";

export function dbConnect() {
    let uri = 'mongodb://localhost:27017/mta_location';
    mongoose.connect(uri, {useNewUrlParser: true}, (err) => {
        if (err) {
            console.log(err.message);
            console.log(err);
        } else {
            console.log('Connected to MongoDb');
        }
    });
}
