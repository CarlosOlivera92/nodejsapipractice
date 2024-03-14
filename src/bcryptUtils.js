import bcrypt from 'bcrypt';

const saltRounds = 10;

// Función para hashear la contraseña
const hashPassword = async (plainPassword) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(plainPassword, salt);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error al hashear la contraseña');
    }
};

// Función para comparar contraseñas
const comparePasswords = async (plainPassword, hashedPassword) => {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        throw new Error('Error al comparar contraseñas');
    }
};

export { hashPassword, comparePasswords };
