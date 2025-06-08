import { setAppointments } from "./appointmentSlice";
import { setCustomers } from "../customers/customerSlice";
import { createNewClient , createNewClientFail , emptyMessages } from "../customers/newClientSlice";
import { setServices , updatedService } from '../services/servicesSlice';
import { createNewService , createNewServiceFail , emptyServiceMessages } from "../services/newServiceSlice";
import { setProfessionals , modifyProfessional } from "../professionals/professionalsSlice";
import { createNewProfessional , createNewProfessionalFail , emptyErrorMessages} from '../professionals/newProfessionalSlice';
import {createNewTenant} from '../tenantsSlice';
import axios from 'axios';
import { urlApi } from "../../../assets/urlApi";



export const getAppointments = (tenantId) => {
console.log('tenantId desde getAppointments',tenantId);

    return async(dispatch,getState) => {

        const resp = await axios.get(`${urlApi}appointment/byTenant/${tenantId}`);
        

        dispatch(setAppointments({appointments: resp.data}));
    };

};

export const getCustomers = (tenantId) => {

    return async(dispatch,getstate) => {

        const resp = await axios.get(`${urlApi}client/byTenant/${tenantId}`);
       

        dispatch(setCustomers({customers: resp.data}));
    }

};


export const updateCustomer = (clientData, dni) => {
    return async (dispatch, getState) => {
        try {
            const resp = await axios.patch(`${urlApi}client/${dni}`, clientData);
            // Despacha una acción para actualizar los clientes en el estado global de Redux
            dispatch(updateCustomerSuccess(resp.data));

            return resp

        } catch (error) {
            console.error('Error updating customer:', error);
        }
    };
};

// Acción para actualizar los clientes en el estado global de Redux
export const updateCustomerSuccess = (updatedCustomerData) => ({
    type: 'customer/updateCustomerSuccess',
    payload: updatedCustomerData
});


export const postNewClient = (dni,name,DateOfBirth,phone,mail,tenantId) => {
   
    return async (dispatch) => {

        try {

            const resp = await axios.post(`${urlApi}client`,{dni,name,DateOfBirth,phone,mail,tenantId});
            dispatch(createNewClient({newClient: resp.data}));
        

        } catch (error) {
            dispatch(createNewClientFail({errorMessage: error.response.data.error}));
        }
        
      
       
       
    }
};

export const cleanMessages = () => {

    return (dispatch) => {
        dispatch(emptyMessages({errorMessage: null}))
    }

};


export const getServices = (tenantId) => {

    return async(dispatch) => {
        
        const resp = await axios.get(`${urlApi}service`, {params: {tenantId}});
        dispatch(setServices({services: resp.data}))
        return resp.data

    }

};

export const updateService = (serviceData,id) => {

    return async(dispatch) => {


        try {
            
            const resp = await axios.patch(`${urlApi}service/${id}`,serviceData);
   
        dispatch(updatedService({updatedService: resp.data}))
        return resp

        } catch (error) {
           throw Error(error.message)
        }
    }
        

};

export const postNewService = (service_name,cost,category,tenantId) => {

    return async(dispatch) => {

       try {

            const resp = await axios.post(`${urlApi}service`,{service_name,cost,category,tenantId});
            dispatch(createNewService({NewService: resp.data}))


            
       } catch (error) {
            dispatch(createNewServiceFail({errorMessage: error.response.data.error}))
       }    

    }

}

export const cleanNewService = () => {

    return async(dispatch) => {
        dispatch(emptyServiceMessages())
    }

};

export const getProfessionals = (tenantId) => {

   return async(dispatch) => {

    const resp = await axios.get(`${urlApi}professional`, {params: {tenantId}});
    console.log('resp',resp.data);
    
    dispatch(setProfessionals({professionals: resp.data}));
   }


};

export const updateProfessional = (updateData,dni) => {
  
    return async(dispatch) => {

        const resp = await axios.patch(`${urlApi}professional/${dni}`,updateData);
        dispatch(modifyProfessional(updateData));
    
        return resp.data;

    }

};

export const postNewProfessional = (dni,name,phone,mail,role,password,services,tenantId) => {
  
    return async(dispatch) => {

        try {

            const resp = await axios.post(`${urlApi}professional`,{dni,name,phone,mail,role,password,services,tenantId});
            dispatch(createNewProfessional({newProfessional: resp.data}));
           
        } catch (error) {

            dispatch(createNewProfessionalFail({errorMessage: error.response.data.error}));
            
        }

    
    }


};

export const emptyFormMessages = () => {

    return async(dispatch) => {

        dispatch(emptyErrorMessages({errorMessage: ''}))

    }

};

export const postNewtenant = (dni,nombre,telefono,mail,rol,password) => {

    return async(dispatch) => {

       const resp = axios.post(`http://localhost:3001/tenant/newtenant`,{dni,nombre,telefono,mail,rol,password});
       dispatch(createNewTenant({NewTenant: resp.data}));
    }

};

