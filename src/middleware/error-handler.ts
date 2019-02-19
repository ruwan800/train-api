import {NextFunction, Request, Response} from 'express';
import {appLogger} from '../util/logging';

export function handleError(error: Error, req: Request, res: Response, next: NextFunction) {
    appLogger.error(error.stack);
  // res.status(500).send("An internal server error occurred")
  res.status(500).send(error.message);
}
