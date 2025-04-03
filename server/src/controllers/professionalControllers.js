const { hashPassword } = require('../assets/funtions/hashPassword');
const {Professional}= require ('../db')
const {Service} = require('../db');

const getAllProfessionals = async () => {

    const allProfessionals = await Professional.findAll(
        {
        // include:[{
        //     model: Service,
        //     attributes: ['service_name'],
        //     through: { attributes: [] }  
        // }],
        order: [['name', 'ASC']]
    }
);

    if(allProfessionals){

        return allProfessionals;
    }

};

const postNewProfessional = async (dni,name,phone,mail,role,password,services) => {

    const existingProfessional = await Professional.findByPk(dni);
   
    
    
    if(existingProfessional){
        throw new Error('Profesional ya registrado')
    }else{

        // hacer el hasheo de la password
   
        const hashedPassword = await hashPassword(password);
     

        const newProfessional = await Professional.create({dni,name,phone,mail,role,password: hashedPassword,services});
     
        
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