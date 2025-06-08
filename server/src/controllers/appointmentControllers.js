const { where } = require("sequelize");
const { Appointment } = require("../db");
const { Client } = require("../db");
const { Professional } = require("../db");
const { Service } = require("../db");
const { Payment } = require("../db");

const postNewAppointment = async (
  date,
  time,
  duration,
  deprived,
  dni,
  professionalDni,
  serviceId,
  tenantId
) => {
  const existingClient = await Client.findByPk(dni);
  const existService = await Service.findByPk(serviceId);
  const cost = existService?.cost;

  if (existingClient) {
    const newAppointment = await Appointment.create({
      date,
      time,
      duration,
      deprived,
      cost,
      TenantId: tenantId,
    });

    if (newAppointment) {
      await newAppointment.setClient(dni);

      const professional = await Professional.findByPk(professionalDni);

      await newAppointment.setProfessional(professional);

      const service = await Service.findByPk(serviceId);

      await newAppointment.setService(service);

      const successMessage = `Turno asignado con éxito`;
      return { successMessage, newAppointment };
    }
  } else {
    throw new Error("Cliente no figura en base de datos");
  }
};
const getAllAppointments = async (tenantId) => {
  console.log('tenantId desde getAllAppointments controller', tenantId);
  
  try {
    const appointments = await Appointment.findAll({
      where: {
        TenantId: tenantId, // Asegúrate de filtrar por el TenantId
      },
      include: [
        {
          model: Client,
          attributes: ['name']
        },
        {
          model: Professional,
          attributes: ['name', 'dni']
        },
        {
          model: Service,
          attributes: ['service_name', 'cost']
        },
        {
          model: Payment,
          attributes: ['amount', 'payment_day', 'payment_mode', 'depositAmount', 'isDeposit', 'attended'], // Usa payment_day si es el campo correcto
          required: false // Esto asegura que la consulta aún devuelva citas incluso si no hay pagos asociados
        }
      ]
    });

    return appointments;
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error; // O maneja el error de la manera que prefieras
  }
};

const getApointmentById = async (id) => {
  const appointment = await Appointment.findByPk(id, {
    include: [
      {
        model: Client,
        attributes: ["name", "dni"],
      },
      {
        model: Professional,
        attributes: ["name"],
      },
      {
        model: Service,
        attributes: ["service_name", "cost", "commission_percentage"],
      },
    ],
  });

  if (appointment) {
    return appointment;
  }
};

const clientAppointments = async (dni, date) => {
  const client = await Client.findByPk(dni);

  if (client) {
    const appointments = await Appointment.findAll({
      where: {
        ClientDni: dni,
        paid: false,
        date: date,
      },
      include: [{ model: Service }, { model: Professional }],
    });

    if (appointments.length === 0) {
      const message = "No hay pagos pendientes";

      return message;
    } else {
      let totalAmont = 0;
      const appointmentData = await appointments.map((appointment) => {
        totalAmont += appointment.Service.cost;
        return {
          id: appointment.id,
          date: appointment.date,
          service_name: appointment.Service.service_name,
          cost: appointment.Service.cost,
          commision_percentage: appointment.Service.commission_percentage,
          professional: appointment.Professional.dni,
        };
      });

      return { appointmentData, totalAmont };
    }
  }
};

const allClientAppointments = async (dni) => {
  const client = await Client.findByPk(dni);

  if (client) {
    const appointments = await Appointment.findAll({
      where: {
        ClientDni: dni,
        paid: false,
      },
      include: [{ model: Service }, { model: Professional }],
    });

    if (appointments.length === 0) {
      const message = "No hay pagos pendientes";
      return message;
    } else {
      // let totalAmont = 0;
      const appointmentData = await appointments.map((appointment) => {
        // totalAmont += appointment.Service.cost;
        return {
          id: appointment.id,
          date: appointment.date,
          service_name: appointment.Service.service_name,
          cost: appointment.Service.cost,
          commision_percentage: appointment.Service.commission_percentage,
          professional: appointment.Professional.dni,
        };
      });

      return appointmentData;
    }
  }
};

const updatedAppointment = async (updateData, id) => {
 

  const foundAppointment = await Appointment.findByPk(id);

  if (foundAppointment) {
    if (Object.hasOwn(updateData, "professionalDni")) {
      await foundAppointment.update({
        ProfessionalDni: updateData.professionalDni,
      });

      const successMessage = "Turno modificado con éxito";

      return { successMessage, foundAppointment };
    }

    if (Object.hasOwn(updateData, "cost")) {

      await foundAppointment.update({
        cost: updateData.cost,
      });

      const foundPayment = await Payment.findAll({
        where: { AppointmentId: foundAppointment.id },
      });
      if (foundPayment && foundPayment.length > 0) {
        await Promise.all(foundPayment.map((pay) => pay.update({ amount: updateData.cost })))
      }

      const successMessage = "Turno modificado con éxito";

      return { successMessage, foundAppointment };
    }
  }
};

const distroyAppointment = async (id) => {
  const appointment = await Appointment.findByPk(id);

  if (appointment) {
    // Elimina todos los pagos relacionados con este appointment
    await Payment.destroy({ where: { AppointmentId: id } });

    // Luego elimina el appointment
    const distroyedAppointment = await appointment.destroy();

    if (distroyedAppointment) {
      const successMessage = "Turno eliminado con éxito";
      return successMessage;
    }
  }
};

const pdAppointment = async (appointmentIds) => {
  const updatedAppointments = await Promise.all(
    appointmentIds.map(async (appointmentId) => {
      const appointment = await Appointment.findByPk(appointmentId);

      if (appointment && appointment.PaymentId !== null) {
        await appointment.update({ paid: true });
        return appointment;
      }
    })
  );

  return updatedAppointments;
};

module.exports = {
  postNewAppointment,
  getAllAppointments,
  getApointmentById,
  updatedAppointment,
  distroyAppointment,
  clientAppointments,
  pdAppointment,
  allClientAppointments,
};
