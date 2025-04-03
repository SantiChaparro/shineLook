import { createSlice } from '@reduxjs/toolkit'
//import axios from 'axios';

const initialState = {
  appointments: [],
}

export const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
        setAppointments: (state,action) => {

          state.appointments = action.payload.appointments;

        }
  },
})

// Action creators are generated for each case reducer function
export const { setAppointments } = appointmentSlice.actions

export default appointmentSlice.reducer