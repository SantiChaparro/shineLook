const {Router} = require('express');
const  {createPreference,successHandler,failHandler,pendingHandler,webHook}  = require('../handlers/mercadoPagoHandler'); 
const mercadoPagoRouter = Router();


mercadoPagoRouter.post('/create-preference',createPreference)
mercadoPagoRouter.get('/success',successHandler);
// mercadoPagoRouter.get('/failure',failHandler);
// mercadoPagoRouter.get('/pending',pendingHandler);
mercadoPagoRouter.post('/webHook',webHook);



module.exports = mercadoPagoRouter;