const {getAllProfessionals,postNewProfessional,getProfessionalById,updatedProfessional} = require('../controllers/professionalControllers');

const getProfecionals = async (req,res) => {

     const {tenantId} = req.query;
     console.log("tenantId", tenantId);

    try {
        
        const professional = await getAllProfessionals(tenantId);

        if(professional){
            res.status(200).json(professional);
        }

    } catch (error) {
        res.status(500).send({error:error.message});
    }

};

const postProfecionals = async (req,res) => {

    const {dni,name,phone,mail,role,password,services,tenantId,profileImage,profileImageId} = req.body;
    console.log('imgUrl',profileImage);
     console.log('imgId',profileImageId);
    
  

   

    try {
        
        const professional = await postNewProfessional(dni,name,phone,mail,role,password,services,tenantId,profileImage,profileImageId);

        if(professional){
            res.status(200).json(professional);
        }

    } catch (error) {
        res.status(500).send({error:error.message});
    }

};
const getProfessional = async (req,res) => {

    const {dni} = req.params;

    try {
        
        const professional = await getProfessionalById(dni);

        if(professional){
            res.status(200).json(professional);
        }

    } catch (error) {
        res.status(500).send({error:error.message});
    }

};

const updateProfessional = async (req,res) => {
    const {dni} = req.params;
    const updateData = req.body;

    try {
        
        const professional = await updatedProfessional(dni,updateData);
        
        if(professional){
            res.status(200).json(professional);
        }

    } catch (error) {
        res.status(500).send({error:error.message});
    }
};

module.exports= {getProfecionals,postProfecionals,getProfessional,updateProfessional}