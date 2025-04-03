const jwt = require('jsonwebtoken');

const generateToken = (professional) => {
    const {dni,rol} = professional;
    const payload = { dni,rol };
    const secretKey = 'qwerty'; // Clave secreta para firmar el token
    const options = { expiresIn: '1h' }; // Opcional: tiempo de expiración del token (1 hora en este ejemplo)
    return jwt.sign(payload, secretKey, options);
};

module.exports = {generateToken}