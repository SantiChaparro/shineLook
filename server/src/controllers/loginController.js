const { Professional } = require('../db');
const jwt = require('jsonwebtoken');

const validatePassword = async ({ dni, password }) => {
    try {
        const professional = await Professional.findByPk(dni);


        if (!professional) {
            throw new Error('Profesional no registrado');
        }

        // Comparación directa de contraseñas
        if (password !== professional.password) {
            throw new Error('Clave incorrecta');
        }

        // Si las contraseñas coinciden, devuelve el objeto professional
        return professional;

    } catch (error) {
        throw error;
    }
};

module.exports = { validatePassword };


// const {Professional} = require('../db');
// const jwt = require('jsonwebtoken');
// const bcrypt = require('bcryptjs');

// const validatePassword = async(dni,password) => {
 
//     const professional = await Professional.findByPk(dni);
  

//     try {
        
//         if(!professional){
//             throw new Error('Profesional no registrado');
//         }else{
    
//            const match = await bcrypt.compare(password,professional.password);
        
//            if(!match){
//                 throw new Error('Clave incorrecta')
//            }else{
//             return professional;
//            }
    
//         }

//     } catch (error) {
//         throw error;
//     }

   

// };

// module.exports = {validatePassword};