//importar los controladores de los tenant

const {createTenant} = require('../controllers/tenantControllers.js');

const postTenant = async (req,res) => {

    const {dni,nombre,telefono,mail,rol,password,activo} = req.body;
    console.log(req.body);

    try {
        const newTenant = await createTenant(dni,nombre,telefono,mail,rol,password,activo);

        if(newTenant){
            res.status(200).json({message:'Tenant creado com éxito!', newTenant});
        }
    } catch (error) {
        res.status(500).json({message:'Error al crear el tenant', error});
    }
    

};



module.exports = {
    postTenant,
}