const {Router} = require('express');
const {postPayment,getPayments } = require('../handlers/paymentHandler'); 
const paymentRouter = Router();


paymentRouter.post('/',postPayment);
paymentRouter.get('/',getPayments)



module.exports = paymentRouter;
