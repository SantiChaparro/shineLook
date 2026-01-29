const { getProfessionalRating, submitRating } = require('../controllers/ratingControllers');

// ------------------------------------------------------------
// GET /ratings/get  → Obtener el promedio del profesional
// ------------------------------------------------------------
const getRating = async (req, res) => {
    const { tenantId, professionalId } = req.query;

    try {
        const professionalRating = await getProfessionalRating(tenantId, professionalId);

        // Si no hay ratings todavía, devolvemos score 0 o null
        if (!professionalRating) {
            return res.status(200).send({
                average: 0,
                count: 0,
                message: "Aún no hay calificaciones para este profesional."
            });
        }

        res.status(200).send(professionalRating);

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


// ------------------------------------------------------------
// GET /ratings/rate  → Recibir rating desde el link enviado por WhatsApp
// ------------------------------------------------------------
// handlers/ratingHandler.js
const getUrlRating = async (req, res) => {
    const { appointmentId, tenantId, professionalDni } = req.query;

    console.log("📩 Datos recibidos para mostrar estrellas:", {
        appointmentId,
        tenantId,
        professionalDni
    });

    if (!appointmentId || !tenantId || !professionalDni) {
        return res.status(400).send({ message: "Missing required parameters." });
    }

    // Definimos los emojis de estrellas
    const stars = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];
    let linksHTML = "";

    // Generamos los links hacia /submitRating
    stars.forEach((star, index) => {
        const score = index + 1;
        linksHTML += `<a href="/rating/submitRating?appointmentId=${appointmentId}&tenantId=${tenantId}&professionalDni=${professionalDni}&score=${score}">${star}</a> `;
    });

    // Devolvemos HTML con las estrellas
    res.send(`
        <h2>¡Gracias por tu visita!</h2>
        <p>Haz click en la estrella para calificar tu experiencia:</p>
        <p>${linksHTML}</p>
    `);
};

// handlers/submitRatingHandler.js


const submitRatingHandler = async (req, res) => {
    // Acepta parámetros tanto de query (GET) como de body (POST)
    const { appointmentId, tenantId, professionalDni, score } = req.body || req.query;

    console.log("📩 Datos recibidos para submitRatingHandler:", {
        appointmentId,
        tenantId,
        professionalDni,
        score
    });

    if (!appointmentId || !tenantId || !professionalDni || !score) {
        return res.status(400).send({ message: "Missing required parameters." });
    }

    try {
        // Llamamos al controller que maneja la lógica de negocio
        const result = await submitRating({
            appointmentId,
            tenantId,
            professionalDni,
            score: Number(score)
        });

        // Devolvemos un HTML simple confirmando el puntaje
        res.send(`
            <h2>¡Gracias!</h2>
            <p>Tu puntaje ${score} fue registrado exitosamente.</p>
            <p>Promedio actual del profesional: ${result.ratingAverage}</p>
        `);

    } catch (error) {
        res.status(400).send(`<p>❌ ${error.message}</p>`);
    }
};





module.exports = { getRating, getUrlRating , submitRatingHandler};
