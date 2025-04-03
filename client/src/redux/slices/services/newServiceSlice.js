import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    NewService: {},
    errorMessage: null
   
}

export const newServiceSlice = createSlice({
    name: 'newService',
    initialState,
    reducers:{
        createNewService: (state,action) => {

           state.NewService = action.payload.NewService;
         

        },
        createNewServiceFail: (state,action) => {

       
        },
        emptyServiceMessages: (state,action) => {
            state.NewService = {}
        }
    }
});

export const { createNewService , createNewServiceFail , emptyServiceMessages } = newServiceSlice.actions;

export default newServiceSlice.reducer;