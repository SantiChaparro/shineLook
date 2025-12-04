import React, { useEffect, useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import QRCode from "react-qr-code";
import axios from "axios";

const Whatsapp = () => {
  const [qrValue, setQrValue] = useState("");
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false); // para indicar envío de mensaje

  // Generar sesión y obtener QR
useEffect(() => {
  let interval;

  const startSession = async () => {
    try {
      setLoading(true);
      await axios.post("http://localhost:3001/whatsapp/start-session");
    } catch (error) {
      console.error("Error iniciando sesión:", error);
    } finally {
      setLoading(false);
    }
  };

  const pollStatus = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/whatsapp/get-qr",
        { headers: { "Cache-Control": "no-cache" } }
      );

      const status = await axios.get('http://localhost:3001/whatsapp/session-status');
      console.log('status del polling',status);

      // ✅ Si hay QR, lo mostramos
      if (res.data?.qr) {
        setQrValue(res.data.qr);
      }

      // ✅ Si está conectado, cortamos polling
      if (status.data?.connected) {
        setConnected(true);
        setQrValue(null);
        clearInterval(interval);
      }

    } catch (err) {
      console.error("Error obteniendo QR:", err);
    }
  };

  startSession();

  interval = setInterval(pollStatus, 2000);

  return () => clearInterval(interval);
}, []);



  // Verificar estado de la sesión
  const checkConnection = async () => {
    try {
      const res = await axios.get("http://localhost:3001/whatsapp/session-status");
      if (res.data.connected) {
        setConnected(true);
      } else {
        alert("Aún no se ha escaneado el QR.");
      }
    } catch (error) {
      console.error("Error al verificar estado de sesión:", error);
    }
  };

  // Enviar mensaje
  const handleSendMessage = async () => {
    setSending(true);
    try {
      const res = await axios.post("http://localhost:3001/whatsapp/send-message", {
        to: "5493513681649", // número de prueba
        text: "Hola amor 😘, ame tus fotos jejeje!"
      });
      console.log('respuesta del envio',res);
      
      
    } catch (error) {
      console.error("Error enviando mensaje:", error);
      alert("Error enviando mensaje");
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, p: 4, alignItems: "center" }}>
      <Typography variant="h5">Conectar WhatsApp</Typography>

      {connected ? (
        <>
          <Typography variant="subtitle1" color="green">¡Conectado!</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={handleSendMessage}
            disabled={sending}
          >
            {sending ? "Enviando..." : "Enviar mensaje"}
          </Button>
        </>
      ) : loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography>Escanea este QR con tu WhatsApp para conectar:</Typography>
          {qrValue && <QRCode value={qrValue} size={200} />}
          <Button
            variant="contained"
            color="success"
            sx={{ mt: 2 }}
            onClick={checkConnection}
          >
            Verificar conexión
          </Button>
        </>
      )}
    </Box>
  );
};

export default Whatsapp;
