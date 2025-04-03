const {Router} = require('express');
const {getServices, postService, updateService, getServiceById, deleteService } = require('../handlers/serviceHandler'); 
const serviceRouter = Router();


serviceRouter.get('/',getServices);
serviceRouter.post('/',postService); 
serviceRouter.get('/:id',getServiceById);
serviceRouter.patch('/:id',updateService);
serviceRouter.delete('/:id',deleteService)


module.exports = serviceRouter;
