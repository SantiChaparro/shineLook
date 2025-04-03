const {
    postNewAppointment,
    getAllAppointments,
    getApointmentById,
    updatedAppointment,
    distroyAppointment,
    clientAppointments,
    pdAppointment,
    allClientAppointments
} = require('../controllers/appointmentControllers');

const postAppointment = async (req, res) => {

    const { date, time, duration, deprived, dni, professionalDni, serviceId } = req.body;

    try {

        const newAppointment = await postNewAppointment(date, time, duration, deprived, dni, professionalDni, serviceId);

        if (newAppointment) {
            res.status(200).json(newAppointment);
        }

    } catch (error) {
        res.status(500).send({ error: error.message });
    }

};

const getAppointments = async (req, res) => {

    try {

        const appointments = await getAllAppointments();
      
        if (appointments) {
            res.status(200).json(appointments);
        }

    } catch (error) {
        res.status(500).send({ error: error.message });
    }

};

const getAppointmentByDni = async (req, res) => {

    const { dni, date } = req.body;

    try {

        if (date) {

            const appointments = await clientAppointments(dni, date);

            if (appointments) {
                res.status(200).json(appointments);
            }

        } else {

            const appointments = await allClientAppointments(dni);

            if (appointments) {
                res.status(200).json(appointments);
            }

        };



    } catch (error) {
        res.status(500).send({ error: error.message });
    }

};

const getAppointment = async (req, res) => {

    const { id } = req.params;


    try {

        const appointment = await getApointmentById(id);

        if (appointment) {
            res.status(200).json(appointment);
        }

    } catch (error) {
        res.status(500).send({ error: error.message });
    }

};

const updateAppointment = async (req, res) => {

    const { id } = req.params;
    const updateData = req.body;



    try {

        const newAppointment = await updatedAppointment(updateData, id);

        if (newAppointment) {
            res.status(200).json(newAppointment);
        }

    } catch (error) {
        res.status(500).send({ error: error.message });
    }


};

const deleteAppointment = async (req, res) => {

    const { id } = req.params;

    try {

        const appointment = await distroyAppointment(id);

        if (appointment) {
            res.status(200).json(appointment);
        }


    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

const paidAppointment = async (req, res) => {

    const { appointmentId } = req.body

    try {

        const appointment = await pdAppointment(appointmentId);

        if (appointment) {
            res.status(200).json(appointment);
        }

    } catch (error) {
        res.status(500).send({ error: error.message });
    }

};


module.exports = { postAppointment, getAppointments, getAppointment, updateAppointment, deleteAppointment, getAppointmentByDni, paidAppointment }