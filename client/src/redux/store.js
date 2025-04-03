import { configureStore } from '@reduxjs/toolkit';
import {appointmentSlice} from './slices/appointments/appointmentSlice';
import { customerSlice } from './slices/customers/customerSlice';
import { newClientSlice } from './slices/customers/newClientSlice';
import { servicesSlice } from './slices/services/servicesSlice';
import { newServiceSlice } from './slices/services/newServiceSlice';
import { professionalsSlice } from './slices/professionals/professionalsSlice';
import { newProfessionalSlice } from './slices/professionals/newProfessionalSlice';

export const store = configureStore({
  reducer: {
    
    appointment: appointmentSlice.reducer,
    customer: customerSlice.reducer,
    newClient: newClientSlice.reducer,
    services: servicesSlice.reducer,
    newService: newServiceSlice.reducer,
    professionals: professionalsSlice.reducer,
    newProfessional: newProfessionalSlice.reducer
  
  },
})