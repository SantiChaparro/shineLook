// /helpers/generateRatingMessage.js
const { generateRatingLinks } = require("./generateRatingLinks");

function generateRatingMessage(clientName, appointmentId, tenantId, professionalDni) {
    const links = generateRatingLinks(appointmentId, tenantId, professionalDni);

    let message = `Hola *${clientName}*, ¡gracias por tu visita! ⭐\n`;
    message += `Nos gustaría saber cómo fue tu experiencia.\n\n`;
    message += `Por favor, calificá tu servicio:\n\n`;

    const stars = ["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"];

    links.forEach((link, i) => {
        message += `${stars[i]} → ${link.url}\n`;
    });

    message += `\n¡Gracias por ayudarnos a mejorar! 💛`;

    return message;
}

module.exports = { generateRatingMessage };
