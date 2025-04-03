import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    professionals: [],
    professional: {},
};

export const professionalsSlice = createSlice({
    name: 'professionals',
    initialState,
    reducers: {
        setProfessionals: (state, action) => {
            state.professionals = action.payload.professionals;
        },
        modifyProfessional: (state,action) => {
            state.professional = action.payload.professional;

        }


    }
});

export const { setProfessionals , modifyProfessional } = professionalsSlice.actions;

export default professionalsSlice.reducer;