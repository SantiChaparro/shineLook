const {Tenants,Professional} = require('../db.js');


const createTenant = async (dni,nombre,telefono,mail,rol,password) => {
    const newTenant = await Tenants.create({
        dni,
        nombre,
        telefono,
        mail,
        rol,
        password
    });

    if(newTenant){
        const newProfessional = await Professional.findByPk(dni);
        if(!newProfessional){
            await Professional.create({
                dni,
                name: nombre,
                phone: telefono,
                mail,
                role:rol,
                password
            });
    }}

    return newTenant;
};


module.exports = {createTenant};