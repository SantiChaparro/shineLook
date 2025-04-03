import { setAppointments } from "./appointmentSlice";
import { setCustomers } from "../customers/customerSlice";
import { createNewClient , createNewClientFail , emptyMessages } from "../customers/newClientSlice";
import { setServices , updatedService } from '../services/servicesSlice';
import { createNewService , createNewServiceFail , emptyServiceMessages } from "../services/newServiceSlice";
import { setProfessionals , modifyProfessional } from "../professionals/professionalsSlice";
import { createNewProfessional , createNewProfessionalFail , emptyErrorMessages} from '../professionals/newProfessionalSlice';
import axios from 'axios';
import { urlApi } from "../../../assets/urlApi";



export const getAppointments = () => {

    return async(dispatch,getState) => {

        const resp = await axios.get(`${urlApi}appointment`);
        

        dispatch(setAppointments({appointments: resp.data}));
    };

};

export const getCustomers = () => {

    return async(dispatch,getstate) => {

        const resp = await axios.get(`${urlApi}client`);
       

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


export const postNewClient = (dni,name,DateOfBirth,phone,mail) => {
   
    return async (dispatch) => {

        try {

            const resp = await axios.post(`${urlApi}client`,{dni,name,DateOfBirth,phone,mail});
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


export const getServices = () => {

    return async(dispatch) => {
        
        const resp = await axios.get(`${urlApi}service`);
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

export const postNewService = (service_name,cost,category) => {

    return async(dispatch) => {

       try {

            const resp = await axios.post(`${urlApi}service`,{service_name,cost,category});
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

export const getProfessionals = () => {

   return async(dispatch) => {

    const resp = await axios.get(`${urlApi}professional`);
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

export const postNewProfessional = (dni,name,phone,mail,role,password,services) => {
  
    return async(dispatch) => {

        try {

            const resp = await axios.post(`${urlApi}professional`,{dni,name,phone,mail,role,password,services});
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


