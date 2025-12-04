const {
    startController,
    statusController,
    getQRController,
    sendMessageController,
    logoutController
} = require('../controllers/whatsappControllers')
const startHandler = async (req, res) => {
  try {
    // Llamamos al controller que inicia la sesión
    await startController();

    // Esperamos hasta que se genere el QR
 
  

    const qr = await getQRController();
    console.log('qr desde handler',qr);
    

    res.status(200).json(qr);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getQRHandler = async (req, res) => {
  try {
    const qr = await getQRController();
    const status = await statusController();

    // ✅ DESACTIVAR CACHE COMPLETAMENTE
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    if (!qr) {
      return res.status(200).json({ status: "waiting", qr: null });
    }

    return res.status(200).json({
         qr,
         connected: status.connected,
     });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


const statusHandler = async(req,res) => {
    try {
        const data = await statusController();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const sendMessageHandler = async(req,res) => {
    const { to, text } = req.body;
    console.log('para',to);
    

    try {
        const data = await sendMessageController(to, text);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};
const logoutHandler = async(req,res) => {
    try {
        const data = await logoutController();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = {
    startHandler,
    statusHandler,
    sendMessageHandler,
    logoutHandler,
    getQRHandler
};