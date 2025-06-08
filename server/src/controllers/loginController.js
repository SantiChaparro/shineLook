const { Professional,Tenants,TenantProfessional } = require('../db');
const jwt = require('jsonwebtoken');
const loginRouter = require('../routes/loginRouter');
const { raw } = require('express');

const validatePassword = async ({ dni, password }) => {
    try {
       console.log('dni desde el controlador', dni);
       console.log('password desde el controllador',password);
       
        
        //primero quiero ver si quien se loguea es un tenant

        const tenant = await Tenants.findOne({ where: { dni } });
        console.log('tenant desde el controlador', tenant);

        if (tenant) {
            if (tenant.password !== password) {
              throw new Error('Clave incorrecta');
            } else {
              console.log(tenant);
              
              return tenant;
            }
          }

        //busco al profesional en la tabla proffesionals

        const professional = await Professional.findByPk(dni);
            console.log('professional desde el controlador', professional);
            
              
        if (!professional) throw new Error('Profesional no registrado');
if (professional.password !== password) throw new Error('Clave incorrecta');

const tenantRelations = await TenantProfessional.findAll({ where: { ProfessionalDni: dni},raw:true });
console.log('tenantRelations desde el controlador', tenantRelations);


if (tenantRelations.length === 1) {
  const tenant = await Tenants.findByPk(tenantRelations[0].TenantId);
  const tenantoptions = {
    tenantId: tenant.id,
    nombre: tenant.nombre
  };
  return { professional, tenantId: tenantoptions };
}

const tenantIds = tenantRelations.map(r => r.TenantId);
const tenants = await Promise.all(tenantIds.map(id => Tenants.findByPk(id)));

const tenantOptions = tenants.map(t => ({
  tenantId: t.id,
  nombre: t.nombre
}));

return { 
    professional, 
    tenantOptions 
  };

        

        // const professional = await Professional.findByPk(dni);


        // if (!professional) {
        //     throw new Error('Profesional no registrado');
        // }

        // // Comparación directa de contraseñas
        // if (password !== professional.password) {
        //     throw new Error('Clave incorrecta');
        // }

        // // Si las contraseñas coinciden, devuelve el objeto professional
        // return professional;

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