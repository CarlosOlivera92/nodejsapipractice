import EErrors from "./enums.js";

export default (error, req, res, next) => {
    try {
        console.log(error);
        switch (error.code) {
            case EErrors.ROUTING_ERROR:
                res.status(404).send({
                    status: 'error',
                    error: error.name,
                    description: error.cause || 'Routing error'
                });
                break;
            case EErrors.CREATE_PRODUCT_ERROR: 
                res.status(400).send({
                    status: 'error',
                    error: error.name,
                    description: error.cause || 'Cannot create product'
                });
                break;
            case EErrors.CREATE_PRODUCT_ERROR: 
                res.status(400).send({
                    status: 'error',
                    error: error.name,
                    description: error.cause || 'Cannot update product'
                });
                break;
            case EErrors.INVALID_TYPE_ERROR:
                res.status(400).send({
                    status: 'error',
                    error: error.name,
                    description: error.cause || 'Invalid type error'
                });
                break;
            case EErrors.USER_NOT_FOUND:
                res.status(404).send({
                    status: 'error',
                    error: error.name,
                    description: error.cause || 'User not found'
                });
                break;
            case EErrors.PRODUCT_NOT_FOUND:
                res.status(404).send({
                    status: 'error',
                    error: error.name,
                    description: error.cause || 'Product not found'
                });
                break;
            case EErrors.INTERNAL_SERVER_ERROR:
                res.status(500).send({
                    status: 'error',
                    error: error.name,
                    description: error.cause || 'Internal server error'
                });
                break;
            case EErrors.DATABASE_ERROR:
                res.status(500).send({
                    status: 'error',
                    error: error.name,
                    description: error.cause || 'Database error'
                });
                break;
            default:
                res.status(500).send({
                    status: 'error',
                    error: error.name,
                    description: error || 'Unknown error'
                });
                break;
        }
    } catch (err) {
        console.error('An error occurred in the error handler:', err);
        next(err); // Continuar con el manejo del error
    }
};
