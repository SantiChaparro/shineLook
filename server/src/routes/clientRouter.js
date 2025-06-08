const {Router} = require('express');
const { getClients, postClient, updateClient, getClientById } = require('../handlers/clientHandler'); 
const clientRouter = Router();


clientRouter.get('/byTenant/:tenantId',getClients);
clientRouter.post('/',postClient);
clientRouter.patch('/:dni',updateClient);
clientRouter.get('/:dni',getClientById); 


module.exports = clientRouter;
