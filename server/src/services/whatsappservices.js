// src/services/whatsappServices.js
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

let client = null;
let qrCode = null;
let isReady = false;

// Iniciar WhatsApp
async function startWhatsApp() {
  if (client) return; // Evitar reiniciar

  client = new Client({
    authStrategy: new LocalAuth({ clientId: "bot-session" }),
    puppeteer: { headless: true }
  });

  client.on('qr', (qr) => {
    qrCode = qr;
    console.log('QR generado:', qr);
    qrcode.generate(qr, { small: true }); // opcional para consola
  });

  client.on('ready', () => {
    console.log('WhatsApp conectado');
    isReady = true;
    qrCode = null;
  });

  client.on('auth_failure', (msg) => {
    console.error('Error de autenticación:', msg);
  });

  client.initialize();
}

// Obtener QR actual
function getQR() {
  return qrCode;
}

// Estado de conexión
function getStatus() {
  return {
    connected: isReady,
    hasQR: !!qrCode
  };
}

// Enviar mensaje
async function sendMessage(to, text) {
  if (!isReady) throw new Error('WhatsApp no está conectado');

  const jid = to.includes('@c.us') || to.includes('@g.us') ? to : `${to}@c.us`;
  return client.sendMessage(jid, text);
}

// Logout / Cerrar sesión
async function logoutWhatsApp() {
  if (!client) return;
  await client.destroy();
  client = null;
  isReady = false;
  qrCode = null;
}

module.exports = {
  startWhatsApp,
  getQR,
  getStatus,
  sendMessage,
  logoutWhatsApp
};
