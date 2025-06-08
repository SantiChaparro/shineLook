const { postNewPayment, getAllPayment } = require('../controllers/paymentControllers');

const postPayment = async (req, res) => {
    const { payment_day, amount, payment_mode, completePayment, depositAmount, isDeposit, attended: attendedData, tenantId } = req.body;
    console.log('tenantId desde postPayment handler', tenantId);
    console.log('req.body',req.body);
    console.log('Tipo de tenantId:', typeof req.body.tenantId);

    const appointmentsId = attendedData?.appointmentsId || req.body.appointmentsId;
    const attended = attendedData?.attended; 
    
    
    try {
        const payment = await postNewPayment(payment_day, amount, payment_mode, appointmentsId, completePayment, depositAmount, isDeposit, attended, tenantId);

        if (payment) {
            res.status(200).json(payment);
        }

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const getPayments = async (req, res) => {
    try {
        const payments = await getAllPayment();

        if (payments) {
            res.status(200).json(payments);
        }

    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

module.exports = { postPayment, getPayments };
