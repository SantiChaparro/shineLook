const { Router } = require('express');
const {
    initWhatsappHandler,
  getQrHandler,
  getStatusHandler,
  sendMessageHandler
} = require('../handlers/whatsappHandler');

const whatsappRouter = Router();

whatsappRouter.post('/start-session', initWhatsappHandler);
whatsappRouter.get('/get-qr/:tenantId', getQrHandler);
whatsappRouter.get('/session-status/:tenantId', getStatusHandler);
whatsappRouter.post('/send-message', sendMessageHandler);
//whatsappRouter.post('/logout', logoutHandler);

module.exports = whatsappRouter;
