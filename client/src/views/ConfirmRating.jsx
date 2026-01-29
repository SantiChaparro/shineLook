import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const TUNNEL_URL = process.env.REACT_APP_FRONT_URL || 'http://localhost:3001';

const ConfirmRating = () => {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState(null);

  const appointmentId = searchParams.get("appointmentId");
  const tenantId = searchParams.get("tenantId");
  const professionalDni = searchParams.get("professionalDni");
  const score = searchParams.get("score");

  const handleSubmitRating = async () => {
    setLoading(true);

    try {
      const response = await axios.post(
        `${TUNNEL_URL}/rating/submitRating`,
        {
          appointmentId,
          tenantId,
          professionalDni,
          score,
        }
      );
      console.log('respuesta desde confir-rating',response);
      

      // Guarda el HTML en el estado
      setResponseMessage(response.data);
    } catch (err) {
      setResponseMessage("<p>Ocurrió un error al registrar el rating.</p>");
    }

    setLoading(false);
  };

  return (
    <div>
      {!responseMessage ? (
        <>
          <h3>
            Vas a puntuar a la profesional con {score} estrellas.
          </h3>

          <button
            onClick={handleSubmitRating}
            disabled={loading}
          >
            {loading ? "Registrando..." : "Votar"}
          </button>
        </>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: responseMessage }}
          style={{ marginTop: "20px", padding: "15px", background: "#f9f9f9" }}
        />
      )}
    </div>
  );
};

export default ConfirmRating;
