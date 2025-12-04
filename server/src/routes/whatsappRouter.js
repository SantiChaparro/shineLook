const { Router } = require('express');
const {
    startHandler,
    statusHandler,
    sendMessageHandler,
    logoutHandler,
    getQRHandler
} = require('../handlers/whatsappHandler');

const whatsappRouter = Router();

whatsappRouter.post('/start-session', startHandler);
whatsappRouter.get('/get-qr', getQRHandler);
whatsappRouter.get('/session-status', statusHandler);
whatsappRouter.post('/send-message', sendMessageHandler);
whatsappRouter.post('/logout', logoutHandler);

module.exports = whatsappRouter;
