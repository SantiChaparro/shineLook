import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  newProfessional: {},
  errorMessage: ''
    
}

export const newProfessionalSlice = createSlice({
    name: 'newProfessional',
    initialState,
    reducers:{
        createNewProfessional: (state,action) => {
            state.newProfessional = action.payload.newProfessional;
        },
        createNewProfessionalFail: (state,action) => {
            state.errorMessage = action.payload.errorMessage;
            state.newProfessional = {};
        },
        emptyErrorMessages: (state,action) => {
            state.errorMessage = action.payload.errorMessage;
            state.newProfessional = {};
        }

    }
});

export const {createNewProfessional , createNewProfessionalFail , emptyErrorMessages} = newProfessionalSlice.actions;

export default newProfessionalSlice.reducer;