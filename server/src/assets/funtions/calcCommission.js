const { Professional, Service, Payment, Appointment } = require("../../db");

const calcCommission = async (payment_day, appointment) => {

  const serviceToPay = appointment.ServiceId;
  const objectComission = appointment.Professional.services.filter(
    (service) => service.idService === serviceToPay
  )[0];


  const paymentsForAppointment = appointment.Payments[0]



  if (appointment.deprived) {
    const amount = (paymentsForAppointment.amount * objectComission.secondary) / 100;


    const date = payment_day;
    const category = appointment.Service.category;


    return { date, amount, category };
  }
  else {
    const amount = (paymentsForAppointment.amount * objectComission.primary) / 100;


    const date = payment_day;
    const category = appointment.Service.category;
    return { date, amount, category }
  }

};

module.exports = { calcCommission };
