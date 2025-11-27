const { hashPassword } = require('../assets/funtions/hashPassword');
const {Professional}= require ('../db')
const {Service,TenantProfessional} = require('../db');
const Tenant = require('../models/Tenant');

// const getAllProfessionals = async (tenantId) => {
//     console.log('tenantId desde controller getprofessional', tenantId);

//     const allProfessionals = await TenantProfessional.findAll({
//         where: {
//             TenantId: tenantId,
//             active: true
//         },
//         include: [
//             {
//                 model: Professional,
//                 attributes: ['dni', 'name', 'phone', 'mail', 'role'],
//                 through: { attributes: [] }
//             }
//         ],
//        // order: [[Professional, 'name', 'ASC']] // <- correcto: ordenás por el nombre dentro del modelo incluido
//     });

//     return allProfessionals;
// };

const getAllProfessionals = async (tenantId) => {
    const professionals = await TenantProfessional.findAll({
        where:{
            TenantId: tenantId,
            active: true
        },
        include: [
            {
                model: Professional,
                attributes: ['dni', 'name', 'phone', 'mail', 'role', 'services','profileImage','profileImageId'],
                //through: { attributes: [] }
            }
        ],
    });
    return professionals
}


const postNewProfessional = async (dni,name,phone,mail,role,password,services,tenantId,profileImage,profileImageId) => {

    const existingProfessional = await Professional.findByPk(dni);
   
    
    
    if(existingProfessional){
        const tenantRelation = await TenantProfessional.findOne({
            where: {
                TenantId: tenantId,
                ProfessionalDni: dni
            }
        })
        if(tenantRelation){
            throw new Error('Profesional ya registrado')}
            else{
                const newProfessional = await TenantProfessional.create({
                    TenantId: tenantId,
                    ProfessionalDni: dni,
                    active: true
                })
            
                const successMessage = "Profesional creado con éxito";
                return {successMessage,newProfessional};
            }   
    }else{

        // hacer el hasheo de la password
   
        const hashedPassword = await hashPassword(password);
     

        const newProfessional = await Professional.create({dni,name,phone,mail,role,password: hashedPassword,services,profileImage,profileImageId});

        // Crear la relación con el tenant
        await TenantProfessional.create({
            TenantId: tenantId,
            ProfessionalDni: dni,
            active: true
        });
     
        
        const successMessage = "Profesional creado con éxito";
        return {successMessage,newProfessional};
    }

   


};

const getProfessionalById = async (dni) => {

    const professional = await Professional.findByPk(dni,{
        include:{
            model: Service,
            attributes:['service_name'],
            through: { attributes: [] } 
        }
    });

    if(professional){
        return professional;
    }else{
        throw new Error('Error al buscar el profesional');
    }

};

const updatedProfessional = async (dni, updateData) => {
  
    const existingProfessional = await Professional.findByPk(dni);
 

    if (existingProfessional) {
        // Actualizar campos principales del profesional
        await existingProfessional.update(updateData);

        const successMessage = `Profesional modificado con éxito`;
        return { successMessage, updatedProfessional: existingProfessional };
    }
};

module.exports={getAllProfessionals,postNewProfessional,getProfessionalById,updatedProfessional}