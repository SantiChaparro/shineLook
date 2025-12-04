const {Router} = require('express');

const loginRouter = require('../routes/loginRouter');
const clientRouter = require ('../routes/clientRouter');
const serviceRouter = require ('../routes/serviceRouter');
const appointmentRouter = require ('../routes/appointmentRouter');
const paymentRouter = require ('../routes/paymentRouter');
const professionalRouter = require ('../routes/professionalRouter');
const commissionRouter = require('../routes/commissionRouter');
const tenantRouter = require ('../routes/tenantRouter');
const mercadoPagoRouter = require ('../routes/mercadoPagoRouter');
const whatsappRouter = require ('../routes/whatsappRouter');
const router = Router();

router.use('/login',loginRouter);
router.use('/client',clientRouter);
router.use('/service',serviceRouter);
router.use('/appointment',appointmentRouter);
router.use('/professional',professionalRouter);
router.use('/payment',paymentRouter);
router.use('/commission',commissionRouter);
router.use('/tenant',tenantRouter);
router.use('/tenant-payment',mercadoPagoRouter);
router.use('/whatsapp',whatsappRouter);

module.exports = router;