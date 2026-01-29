require('dotenv').config();

const ngrokjUrl = process.env.TUNNEL_URL || 'http://localhost:3001'

// Apuntamos al endpoint del servidor que redirige al frontend
const BASE_URL = `${ngrokjUrl}/rating/confirm-rating`;

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
