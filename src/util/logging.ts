const winston = require('winston');
const SESSION = Symbol.for('session');

const requestResponseLevels = {
    levels: {
        request: 0,
        response: 1,
    },
    colors: {
        request: 'green',
        response: 'yellow',
    }
};
const requestFormat = winston.format.printf((info: any) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});
winston.addColors(requestResponseLevels.colors);
const requestLoggerTransporter = [
    // new winston.transports.Console({
    //     level: 'response',
    // })];
    new winston.transports.File({
        level: 'response',
        filename: 'log/request.log',
    })
];
export const requestLogger = winston.createLogger({
    levels: requestResponseLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        requestFormat
    ),
    label: 'request',
    transports: requestLoggerTransporter
});

// TODO use a package like express-http-context to get session info.
const sessionData = winston.format(function (info: any) {
    info[SESSION] = {user_id: 0, progress_id: 0};
    return info;
});


const appFormat = winston.format.printf((info: any) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
});
const appLoggerTransporter = [
    // new winston.transports.Console({
    //     level: 'info',
    //     label: 'app'
    // })]
    new winston.transports.File({
        filename: 'log/app.log',
        level: 'info',
        label: 'app'
    })
];
export const appLogger = winston.createLogger({
    format: winston.format.combine(
        winston.format.timestamp(),
        sessionData(),
        appFormat,
    ),
    transports: appLoggerTransporter
});