const {Router} = require('express');
const {postAppointment,getAppointments,getAppointment,updateAppointment,deleteAppointment,getAppointmentByDni,paidAppointment} = require('../handlers/appointmentHandler');
const appointmentRouter = Router();

 appointmentRouter.get('/client',getAppointmentByDni);
 appointmentRouter.post('/',postAppointment); 
 appointmentRouter.get('/byTenant/:tenantId',getAppointments);
 appointmentRouter.patch('/paid',paidAppointment);
 appointmentRouter.get('/:id',getAppointment);
 appointmentRouter.patch('/:id',updateAppointment);
 appointmentRouter.delete('/:id',deleteAppointment);
 


module.exports = appointmentRouter;
