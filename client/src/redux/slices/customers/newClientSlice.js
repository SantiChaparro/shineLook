import { createSlice } from "@reduxjs/toolkit";



const initialState = {
    newClient: {},
    errorMessage: null
}


export const newClientSlice = createSlice({
    name: 'newClient',
    initialState,
    reducers:{
        createNewClient: (state,action) => {

            state.newClient = action.payload.newClient;
            state.errorMessage = null;

        },
        createNewClientFail: (state,action) => {
            state.errorMessage = action.payload.errorMessage;
            state.newClient = {};
        },
        emptyMessages: (state,action) => {
            state.errorMessage = action.payload.errorMessage;
            state.newClient = {};
        }
    }

})

export const {createNewClient , createNewClientFail , emptyMessages} = newClientSlice.actions;

export default newClientSlice.reducer;