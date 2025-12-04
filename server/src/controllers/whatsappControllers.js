const {
    startWhatsApp,
    getQR,
    getStatus,
    sendMessage,
    logoutWhatsApp
} = require ('../services/whatsappservices.js');
const startController = async () => {
  await startWhatsApp();

  // Esperar hasta que se genere el QR
  const waitForQR = () =>
    new Promise((resolve) => {
      const interval = setInterval(() => {
        const qr = getQR();
        if (qr) {
          clearInterval(interval);
          resolve(qr);
        }
      }, 500);

      setTimeout(() => {
        clearInterval(interval);
        resolve(null);
      }, 10000); // 10 segundos máximo
    });

  const qr = await waitForQR();
  const status = await getStatus();
  console.log('QR desde startController:', qr);

  return { qr, status };
};

const getQRController = async() => {
        
     const qr = await getQR();
     console.log('qre desde getQrController',qr);
     return qr;
};

const statusController = async() => {
    return await getStatus();
};

const sendMessageController = async(to, text) => {
    return await sendMessage(to, text);
};

const logoutController = async() => {
    return await logoutWhatsApp();
}
module.exports = {
    startController,
    getQRController,
    statusController,
    sendMessageController,
    logoutController
}