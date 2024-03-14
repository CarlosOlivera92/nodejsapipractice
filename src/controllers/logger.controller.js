export default class LoggerController {
    constructor() {
        this.getLogger = this.getLogger.bind(this);
    }
    async getLogger (req, res) {
        req.logger.error('prueba error');
        req.logger.warning('prueba warning');
        req.logger.info('prueba info');
        req.logger.debug('prueba debug');
    
        res.send({ result: 'hola' });
    }
    async loggerTest(req, res) {
        req.logger.fatal('Test fatal log');
        req.logger.error('Test error log');
        req.logger.warning('Test warning log');
        req.logger.info('Test info log');
        req.logger.debug('Test debug log');

        res.send({ result: 'loggerTest ejecutado' });
    }
}