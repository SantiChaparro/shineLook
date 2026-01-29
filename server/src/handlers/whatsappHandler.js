const { initSession, getQR, getStatus, sendMessage } = require("../services/whatsappservices");

async function initWhatsappHandler(req, res) {
  const { tenantId } = req.body;
  if (!tenantId) return res.status(400).json({ error: "tenantId requerido" });

  try {
    const status = getStatus(tenantId);

    // ⛔ Bloquea sesiones duplicadas
    if (status && (status.connection === "connecting" || status.connection === "open" || status.qr)) {
      console.log(`⚠️ Sesión ya existente para tenant ${tenantId}, no se reinicia`);
      return res.json({ ok: true, alreadyStarted: true });
    }

    await initSession(tenantId);
    res.json({ ok: true, started: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

function getQrHandler(req, res) {
  const tenantId = req.params.tenantId;
  const qr = getQR(tenantId);
  res.json({ qr });
}

function getStatusHandler(req, res) {
  const tenantId = req.params.tenantId;
  const status = getStatus(tenantId);
  res.json(status);
}

async function sendMessageHandler(req, res) {
  const { tenantId, to, text } = req.body;
  try {
    await sendMessage(tenantId, to, text);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  initWhatsappHandler,
  getQrHandler,
  getStatusHandler,
  sendMessageHandler,
};
