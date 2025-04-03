import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    customers: [],
}

export const customerSlice = createSlice({
    name: 'customers',
    initialState,
    reducers: {
          setCustomers: (state,action) => {
  
            state.customers = action.payload.customers;
  
          },
          updateCustomerSuccess: (state, action) => {
            // Actualiza los clientes con los datos del cliente actualizado
            const updatedCustomer = action.payload;
            state.customers = state.customers.map(customer => 
                customer.dni === updatedCustomer.dni ? updatedCustomer : customer
            );
        },
    },
    },
  )
  
  // Action creators are generated for each case reducer function
  export const { setCustomers , updateCustomerSuccess } = customerSlice.actions
  
  export default customerSlice.reducer