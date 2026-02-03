require('dotenv').config();


// Detectamos automáticamente si estamos en local o en producción
const isLocal = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

// URL base para el backend que redirige al frontend
const localBackendUrl = 'http://localhost:3001';  // tu backend local
const prodBackendUrl = process.env.REACT_APP_API_URL ;

const URL = isLocal ? localBackendUrl : prodBackendUrl;

// Apuntamos al endpoint del servidor que redirige al frontend
const BASE_URL = `${URL}/rating/confirm-rating`;
function generateRatingLinks(appointmentId, tenantId, professionalDni) {
    const links = [];

    for (let score = 1; score <= 5; score++) {
        const url = `${BASE_URL}?appointmentId=${appointmentId}&tenantId=${tenantId}&professionalDni=${professionalDni}&score=${score}`;
        
        // Agregamos el emoji para cada score
        const stars = "⭐".repeat(score);

        links.push({
            score,
            stars,
            url
        });
    }

    return links;
}

module.exports = { generateRatingLinks };
