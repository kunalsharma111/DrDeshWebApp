const { createLogger,
transports,
format
} = require('winston');

const logger = createLogger({
    transports:[
        new transports.File({
            filename:'logger/info.log',
            level : 'info',
            json: true,
            format : format.combine(format.timestamp(),format.json())
        }),
        new transports.File({
            filename:'logger/error-info.log',
            level : 'error',
            json: 'true',
            format : format.combine(format.timestamp(),format.json())
        })
    ]
})

module.exports = logger;