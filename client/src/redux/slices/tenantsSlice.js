import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    NewTenant: {},
    tenantId: null,
    errorMessage: null
   
}

export const tenantSlice = createSlice({
    name: 'newTenant',
    initialState,
    reducers:{
        createNewTenant: (state,action) => {

           state.NewTenant = action.payload.NewTenant;
         

        },

        storageTenantId: (state,action) => {
            state.tenantId = action.payload.tenantId;
            console.log('action.payload.tenantId',action.payload.tenantId);
            
        },

        clearTenantId: (state) => {
            state.tenantId = null;
        },
        
    }
});

export const { createNewTenant,storageTenantId,clearTenantId} = tenantSlice.actions;

export default tenantSlice.reducer;