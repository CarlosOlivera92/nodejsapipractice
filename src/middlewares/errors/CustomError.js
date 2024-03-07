export default class CustomError {
    static createError({ name = 'Error', cause, message, code = 1 }) {
        try {
            let error = new Error(message, { cause });
            error.name = name;
            error.code = code;
            return error;
        } catch (err) {
            console.error('An error occurred while creating custom error:', err);
            return new Error('An error occurred while creating custom error');
        }
    }
}
