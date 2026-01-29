import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import QRCode from "react-qr-code";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Whatsapp() {
  const tenantId = useSelector((state) => state.tenant.tenantId);
  const [qr, setQr] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  if (!tenantId) return;

  let interval;

  const start = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:3001/whatsapp/start-session", { tenantId });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const poll = async () => {
    try {
      const status = await axios.get(
        `http://localhost:3001/whatsapp/session-status/${tenantId}`,
        { headers: { "Cache-Control": "no-cache" } }
      );

      if (status.data.connected) {
        setConnected(true);
        setQr(null);
        return;
      }

      const qrRes = await axios.get(
        `http://localhost:3001/whatsapp/get-qr/${tenantId}`,
        { headers: { "Cache-Control": "no-cache" } }
      );

      setQr(qrRes.data.qr || null);
    } catch (err) {
      console.error(err);
    }
  };

  start();
  interval = setInterval(poll, 2000);

  return () => clearInterval(interval);
}, [tenantId]); // ✅ SOLO tenantId


  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: 4,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography variant="h5">Conectar WhatsApp</Typography>

      {connected ? (
        <Typography variant="h6" color="success.main">
          ✅ WhatsApp conectado
        </Typography>
      ) : loading ? (
        <CircularProgress />
      ) : qr ? (
        <>
          <Typography>Escaneá este QR con WhatsApp</Typography>
          <QRCode value={qr} size={220} />
        </>
      ) : (
        <Typography color="text.secondary">Esperando QR...</Typography>
      )}
    </Box>
  );
}
