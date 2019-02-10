import * as express from 'express';
import {Application} from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import {Routes} from './routes';
import {dbConnect} from "./util/db_connect";

// Creates and configures an ExpressJS web server.
class App {

    // ref to Express instance
    public express: Application;

    // Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        dbConnect();
        this.middleware();
        this.routes();
    }

    // Configure Express middleware.
    private middleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
    }

    // Configure API endpoints.
    private routes(): void {
        let router = express.Router();
        router.get('/', (req, res, next) => {
            res.json({
                message: 'Train Location API!'
            });
        });
        Routes.init(router);
        this.express.use('/', router);
    }
}

export default new App().express;
