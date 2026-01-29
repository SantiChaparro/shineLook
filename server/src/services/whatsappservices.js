const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require("@whiskeysockets/baileys");
const Pino = require("pino");

const sessions = {}; 
// tenantId -> { sock, getQR, isReady, state, initPromise }
const initPromises = {}; // Para evitar inicializaciones simultáneas

async function initSession(tenantId) {
  // 🔒 Si ya hay sesión activa (abierta), no crear otra
  if (sessions[tenantId]?.state === "open") {
    console.log(`ℹ️ Sesión ya conectada para tenant ${tenantId}`);
    return sessions[tenantId];
  }

  // 🔒 Si ya está inicializando, esperar esa inicialización
  if (initPromises[tenantId]) {
    console.log(`⏳ Ya inicializando sesión para tenant ${tenantId}, esperando...`);
    return initPromises[tenantId];
  }

  // 🧹 Limpiar sesión vieja si existe
  if (sessions[tenantId]?.sock) {
    console.log(`⚠️ Limpiando sesión vieja para tenant ${tenantId}`);
    try { sessions[tenantId].sock.end(); } catch (e) {}
    delete sessions[tenantId];
  }

  // Crear promise de inicialización
  const initPromise = (async () => {
    const { state, saveCreds } = await useMultiFileAuthState(`auth/${tenantId}`);

    let qr = null;
    let isReady = false;
    let qrTimeout = null;
    let recoveryTimeout = null;
    let hasQR = false; // Bandera para rastrear si generamos QR

    const sock = makeWASocket({
      auth: state,
      logger: Pino({ level: "silent" }),
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
      const { connection, lastDisconnect, qr: newQr, isNewLogin } = update;
      console.log("estado", update);

      // 👉 Verificar que la sesión aún existe
      if (!sessions[tenantId]) return;

      // 👉 Solo aceptar QR si NO estamos ya conectados
      if (newQr && !isReady) {
        qr = newQr;
        hasQR = true;
        sessions[tenantId].state = "qr";
        console.log(`📲 QR generado (${tenantId}) - Esperando escaneo...`);
        
        // Limpiar timeouts previos
        if (recoveryTimeout) clearTimeout(recoveryTimeout);
        if (qrTimeout) clearTimeout(qrTimeout);
        
        // ⏰ Si no escanean en 60s total, generar nuevo QR
        qrTimeout = setTimeout(() => {
          console.log(`⏱️ Timeout 60s esperando escaneo (${tenantId}), generando nuevo QR...`);
          if (sessions[tenantId]?.sock) {
            try { sessions[tenantId].sock.end(); } catch (e) {}
          }
        }, 60000);
      }

      if (connection === "open") {
        console.log(`✅ WhatsApp conectado (${tenantId})`);
        isReady = true;
        sessions[tenantId].state = "open";
        qr = null;
        hasQR = false;
        if (qrTimeout) clearTimeout(qrTimeout);
        if (recoveryTimeout) clearTimeout(recoveryTimeout);
      }

      if (connection === "close") {
        const statusCode = lastDisconnect?.error?.output?.statusCode;
        const reason = lastDisconnect?.error?.message;

        console.log("razon", statusCode || reason);

        if (statusCode === DisconnectReason.loggedOut) {
          console.log(`❌ Sesión cerrada definitivamente (${tenantId})`);
          delete sessions[tenantId];
          delete initPromises[tenantId];
          if (qrTimeout) clearTimeout(qrTimeout);
          if (recoveryTimeout) clearTimeout(recoveryTimeout);
          return;
        }

        // 🔄 FASE 1: Si tenía QR, iniciar recuperación silenciosa (30s)
        if (hasQR && sessions[tenantId]?.state === "qr") {
          console.log(`⏳ [FASE RESILIENCIA 30s] QR en espera, esperando reconexión automática (${tenantId})`);
          
          if (recoveryTimeout) clearTimeout(recoveryTimeout);
          recoveryTimeout = setTimeout(() => {
            console.log(`⏱️ [TIMEOUT 30s] Socket no se recuperó, reiniciando sesión (${tenantId})`);
            isReady = false;
            qr = null;
            if (qrTimeout) clearTimeout(qrTimeout);
            delete initPromises[tenantId];
            
            // Reiniciar sesión para generar nuevo QR
            setTimeout(() => initSession(tenantId), 1000);
          }, 30000);
          
          return; // No hacer nada más, solo esperar
        }

        // 🔄 FASE 2: Para otros casos (conexión = connecting, error temprano, etc)
        isReady = false;
        qr = null;
        if (qrTimeout) clearTimeout(qrTimeout);
        if (recoveryTimeout) clearTimeout(recoveryTimeout);
        
        if (sessions[tenantId]) {
          sessions[tenantId].state = "closed";
        }
        console.log(`🔄 Desconexión sin QR, reconectando en 5s (${tenantId})`);
        delete initPromises[tenantId];
        setTimeout(() => initSession(tenantId), 5000);
      }
    });

    sock.ev.on("ws.error", (err) => {
      console.error(`⚠️ WebSocket error (${tenantId}):`, err.message);
    });

    sessions[tenantId] = {
      sock,
      getQR: () => qr,
      isReady: () => isReady,
      state: "connecting",
    };

    return sessions[tenantId];
  })();

  initPromises[tenantId] = initPromise;
  const result = await initPromise;
  delete initPromises[tenantId];
  return result;
}

// 🔹 Devuelve el QR actual
function getQR(tenantId) {
  return sessions[tenantId]?.getQR() || null;
}

// 🔹 Devuelve el estado de conexión
function getStatus(tenantId) {
  const s = sessions[tenantId];
  return {
    connected: s?.isReady() || false,
    hasQR: !!s?.getQR(),
    state: s?.state || "none",
  };
}

// 🔹 Enviar mensaje
async function sendMessage(tenantId, to, text) {
  const session = sessions[tenantId];
  if (!session || !session.isReady()) throw new Error("WhatsApp no conectado");

  let num = to.toString().replace(/\D/g, "");
  if (!num.startsWith("549")) {
    if (num.startsWith("54")) num = "549" + num.slice(2);
    else num = "549" + num;
  }

  const jid = `${num}@s.whatsapp.net`;
  await session.sock.sendMessage(jid, { text });
}

module.exports = {
  initSession,
  getQR,
  getStatus,
  sendMessage,
};
