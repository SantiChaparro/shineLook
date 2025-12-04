const { startWhatsApp, sendMessage } = require('./whatsappservices');

async function pruebaEnvio() {
    try {
       console.log('estas en el envio de mensajes');
       

        // Esperar evento ready
        await new Promise((resolve) => {
            const { getStatus } = require('./whatsappservices');
            const interval = setInterval(() => {
                if (getStatus().connected) {
                    clearInterval(interval);
                    resolve();
                }
            }, 500);
        });

        // Enviar mensaje
        const resultado = await sendMessage('5493513681649', 'Hola amor 😘, mensaje desde el bot!');
        console.log('Mensaje enviado:', resultado);

    } catch (error) {
        console.error('Error enviando mensaje:', error);
    }
}

pruebaEnvio();
