import winston from 'winston';
import dotenv from 'dotenv';

dotenv.config();
const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'magenta',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'cyan',
        debug: 'blue'
    }
};

// Configuración del logger de desarrollo
const developmentLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({
                    all: true,
                    colors: customLevelOptions.colors
                }),
                winston.format.simple()
            )
        })
    ]
});

// Configuración del logger de producción
const productionLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.File({
            filename: process.env.ERROR_LOG_FILE || 'errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
});

export const addLogger = (req, res, next) => {
    // Determina el entorno (desarrollo o producción)
    const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

    req.logger = logger;
    req.logger.info(`${req.method} en ${req.url} - ${new Date().toISOString()}`);
    next();
};