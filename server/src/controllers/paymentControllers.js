const { Payment, Appointment, Commission, Professional, Service, Tenants } = require('../db');
const { calcCommission } = require('../assets/funtions/calcCommission');

const postNewPayment = async (payment_day, amount, payment_mode, appointmentsId, completePayment, depositAmount, isDeposit, attended, tenantId) => {
    let amountValues = parseFloat(depositAmount);
    console.log('tenantId desde postNewPayment controller', tenantId);
    console.log('appointmentsids desde postNewPayment controller', appointmentsId);
    
    
    try {
        if (attended) {
            console.log('array de appointsments',appointmentsId);
            
            const appointmentId = appointmentsId[0]; // Se asume que appointmentsId contiene un solo ID en este caso
            const appointment = await Appointment.findByPk(appointmentId, {
                include: [{ model: Professional }, { model: Service }, { model: Payment }]
            });
            console.log('tenantId antes de findbypk',tenantId);
            
            const tenant = await Tenants.findByPk(tenantId);
            console.log('tenant desde postNewPayment controller', tenant);
            

            if (!appointment) {
                throw new Error(`No se encontró la cita con el ID ${appointmentId}`);
            }

            await Payment.update({ attended: attended }, { where: { AppointmentId: appointmentId } });

            // Verificar si ya existe una comisión para esta cita

            const existingCommissions = await Commission.findAll({
                where: { AppointmentId: appointment.id }
            });

            if (existingCommissions.length === 0 && attended === 'Si') {
                // Ejecutar la función para calcular la comisión
                const commissions = await calcCommission(appointment.date, appointment);
                const postCommission = await Commission.create(commissions);

                // Asociar la comisión con la cita
                await postCommission.setProfessional(appointment.Professional);
                await postCommission.setService(appointment.Service);
                await postCommission.setAppointment(appointment);
                await postCommission.setTenant(tenant);
            } else if (attended === 'No') {

                let remainingAmount = 0;

                const paymentsForAppointment = appointment.Payments || [];
                paymentsForAppointment.forEach(payment => {
                    console.log('payment desde postNewPayment controller', payment);
                    
                    if (!payment.paid) {
                        remainingAmount += payment.depositAmount || 0;
                    }
                });
                const postCommission = await Commission.create({ date: appointment.date, amount: remainingAmount });
                await postCommission.setAppointment(appointment);
            }

            return { successMessage: 'Campo attended actualizado con éxito' };
        }

        if (isDeposit) {
            console.log('tenantid desde pago seña',tenantId);
            
            // Crear un pago con el monto total y el depósito
            const payment = await Payment.create({
                payment_day,
                amount,
                payment_mode,
                depositAmount: amountValues,
                isDeposit,
                state: 'Pendiente',
                TenantId: tenantId
            });

            if (payment) {
                console.log('payment de la seña', payment);
                
                await Promise.all(appointmentsId.map(async (appointmentId) => {
                    const appointment = await Appointment.findByPk(appointmentId, {
                        include: [{ model: Professional }, { model: Service }]
                    });

                    if (appointment) {
                        // Asociar el pago con la cita
                        await appointment.addPayment(payment);

                        // Si el monto es igual al valor del depósito, marcar la cita como pagada
                        if (amount === amountValues) {
                            await appointment.update({ paid: true });
                        }
                    } else {
                        throw new Error(`No se encontró la cita con el ID ${appointmentId}`);
                    }
                }));

                const successMessage = 'Pago registrado con éxito';
                return { successMessage, payment };
            }

        } else {
            // Crear un pago para cada cita calculando el monto total y el depósito
            const payments = [];

            for (const appointmentId of appointmentsId) {
                const appointment = await Appointment.findByPk(appointmentId, {
                    include: [{ model: Payment }, { model: Professional }, { model: Service }]
                });

                if (!appointment) {
                    throw new Error(`No se encontró la cita con el ID ${appointmentId}`);
                }

                // Calcular el monto total y el depósito restante para esta cita
                let totalAmount = 0;
                let remainingAmount = 0;

                const paymentsForAppointment = appointment.Payments || [];
                paymentsForAppointment.forEach(payment => {
                    totalAmount = payment.amount;
                    if (!payment.paid) {
                        remainingAmount += payment.depositAmount || 0;
                    }
                });

                // Calcular el depósito a aplicar para esta cita
                const depositToApply = totalAmount - remainingAmount;

                if (amountValues >= depositToApply && depositToApply >= 0) {
                    // Crear el pago para esta cita
                    const payment = await Payment.create({
                        payment_day,
                        amount: totalAmount,
                        depositAmount: depositToApply,
                        payment_mode,
                        state: 'Pendiente',
                        TenantId: tenantId
                    });

                    // Actualizar el valor de amountValues restando depositToApply
                    amountValues -= depositToApply;

                    // Asociar el pago con la cita
                    await appointment.addPayment(payment);

                    if (completePayment || totalAmount === remainingAmount) {
                        await appointment.update({ paid: true });
                    }

                    payments.push(payment);
                } else if (amountValues > 0 && appointment.paid !== true && totalAmount !== remainingAmount) {
                    // Crear el pago con la cantidad restante en amountValues
                    const payment = await Payment.create({
                        payment_day,
                        amount: totalAmount,
                        depositAmount: amountValues,
                        payment_mode,
                        state: 'Pendiente',
                        TenantId: tenantId
                    });

                    // Asociar el pago con la cita
                    await appointment.addPayment(payment);

                    // Actualizar amountValues a 0
                    amountValues = 0;

                    if (totalAmount === remainingAmount) {
                        await appointment.update({ paid: true });
                    }

                    payments.push(payment);
                }

                if (amountValues === 0) {
                    break; // Salir del bucle si amountValues es 0
                }
            }

            const successMessage = 'Pagos registrados con éxito';
            return { successMessage, payments };
        }

    } catch (error) {
        console.error("Error al registrar el pago:", error);
        throw error; // Maneja el error de la manera que prefieras
    }
};

const getAllPayment = async () => {
    const payments = await Payment.findAll();
    if (payments) {
        return payments;
    }
};

module.exports = { postNewPayment, getAllPayment };
