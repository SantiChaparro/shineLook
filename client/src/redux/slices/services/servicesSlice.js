import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    services: [],
    updatedService: {}
}

export const servicesSlice = createSlice({
    name: 'services',
    initialState,
    reducers:{
        setServices: (state,action) => {

            state.services = action.payload.services

        },
        updatedService: (state,action) => {

            state.updatedService = action.payload.updatedService;
            state.services = state.services.map(service => {
                if (service.id === updatedService.id) {
                    return updatedService; // Actualiza el servicio con los nuevos datos
                }
                return service;
            });
            state.updatedService = updatedService;

        }
    }
});

export const { setServices , updatedService } = servicesSlice.actions;

export default servicesSlice.reducer;