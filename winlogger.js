/*
** winLogger: Set the use of Winston for logging purposes
** Logs to console and to file
**
** Use: winLogger.<level>('Message')
** Set process.env to production. Default is development
*/
'use strict';

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');


const winLogEnv = process.env.NODE_ENV || 'development';
const logDir = 'log';

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const dailyRotateFileTransport = new transports.DailyRotateFile({
    filename: `${logDir}/%DATE%-general.log`,
    datePattern: 'YYYY-MM-DD'
});

const winLogger = createLogger({ 
    // Change level if in dev environment versus production
    level: winLogEnv === 'development' ? 'debug' : 'info',
    format: format.combine(
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.json()
    ),
    transports: [
        new transports.Console({
            level: 'info',
            format: format.combine (
                format.colorize(),
                format.printf(
                    info => `${info.timestamp} ${info.level} [${info.label}]: ${info.message}`
                )
            )
        }),
        dailyRotateFileTransport
    ]
});

module.exports = winLogger;