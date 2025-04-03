const { postNewPayment, getAllPayment } = require('../controllers/paymentControllers');

const postPayment = async (req, res) => {
    const { payment_day, amount, payment_mode, appointmentsId, completePayment, depositAmount, isDeposit, attended } = req.body;

    try {
        const payment = await postNewPayment(payment_day, amount, payment_mode, appointmentsId, completePayment, depositAmount, isDeposit, attended);

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
