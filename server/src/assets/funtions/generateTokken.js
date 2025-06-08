const jwt = require('jsonwebtoken');

const generateToken = (professional) => {
    //const { dni, role } = professional.get({ plain: true }); // esto es clave
    const {dni,role} = professional.professional;
    console.log('dni desde generate tokken', dni);
    console.log('role desde generate tokken ',role);
    console.log('professional desde generatetokken',professional);
    
    
    const payload = { dni,role };
    const secretKey = 'qwerty'; // Clave secreta para firmar el token
    const options = { expiresIn: '1h' }; // Opcional: tiempo de expiración del token (1 hora en este ejemplo)
    console.log('Payload antes de firmar:', payload); // <-- AGREGADO
    const token = jwt.sign(payload, secretKey, options);
    const decoded = jwt.decode(token);
    console.log('Token decodificado:', decoded);
    return token;
};

module.exports = {generateToken}