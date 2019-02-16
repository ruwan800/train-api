import {Request, Response} from 'express';
import {requestLogger} from '../util/logging';

export function logRequest(req: Request, res: Response, next: any) {
  requestLogger.request(req.method + '::' + req.url /*+ (req.decoded ? ", USER=" + req.decoded.id : "")*/);
  requestLogger.response(res.statusCode + '::' + (res.statusMessage !== undefined ? res.statusMessage : 'DONE'));
  next();
}
