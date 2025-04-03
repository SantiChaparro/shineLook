const {Router} = require('express');
const { getProfecionals,postProfecionals,getProfessional,updateProfessional } = require('../handlers/professionalHandler'); 
const professionalRouter = Router();

 professionalRouter.post('/', postProfecionals);
 professionalRouter.get('/', getProfecionals);
 professionalRouter.get('/:dni',getProfessional);
 professionalRouter.patch('/:dni',updateProfessional);



module.exports = professionalRouter;
