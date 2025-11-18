

const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();

const { MERCADO_PAGO_ACCES_TOKEN,MP_TEST_ACCESS_TOKEN } = process.env;

const client = new MercadoPagoConfig({
  accessToken: MP_TEST_ACCESS_TOKEN, 
});

const createPreference = async (req, res) => {

    const plan = {
        title: 'plan base',
        quantity: 1,
        unit_price: 100,
    }

    const preference = new Preference(client);

    try {
         const response = await preference.create({
            body: {
              items:[plan], // Asignamos los items que creamos antes
              back_urls: {
                success: `https://99f9-2803-9800-9880-b20f-f406-d22e-488d-4563.ngrok-free.app/tenant-payment/success`, // URL de éxito
                failure: `https://www.google.com`, // URL de fallo  
                pending: `https://www.google.com`, // URL de pendiente
              
              },
              notification_url: "https://99f9-2803-9800-9880-b20f-f406-d22e-488d-4563.ngrok-free.app/tenant-payment/webhook",
              external_reference:"28271453",
              auto_return: "approved", // Opción de auto-retorno
            },
          });

          console.log('respuesta create preference',response);
          res.status(200).json(response);
          
      
    } catch (error) {
        res.status(500).json({ error: 'Error creating preference', details: error.message });
    }

}

const successHandler = async(req, res) => {
  console.log('req.query de success',req.query);
  
};

const webHook = async (req, res) => {
  const paymentId = req.body?.data?.id || req.query?.id;
  const topic = req.body?.type || req.query?.topic;

  console.log("📩 Webhook recibido:", { id: paymentId, topic });

  if (topic === 'payment' && paymentId) {
    try {
      const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${process.env.MP_TEST_ACCESS_TOKEN}`,
        },
      });

      const paymentData = await response.json();
      console.log('✅ Datos reales del pago:', paymentData);

      // Aquí podés guardar en DB, activar un tenant, etc.

    } catch (error) {
      console.error('❌ Error al consultar el pago:', error.message);
    }
  }

  res.status(200).json({ message: '✅ Webhook recibido correctamente' });
};

module.exports = {
    createPreference,
    successHandler,
webHook  }