const {Service} = require('../db');
const Tenant = require('../models/Tenant');


const getAllServices = async (tenantId) => {


    const services = await Service.findAll({
        where: {
            TenantId: tenantId,
            isDeleted: false
        },
        order: [['service_name', 'ASC']]
    });

    if(services){
     
        return services;
    }else{
        throw new Error('Problema al cargar los servicios');
    }

};

const postNewService = async (service_name,cost,category,tenantId) => {

    const service = await Service.create({service_name,cost,category,TenantId: tenantId});

    if(service){

        const successMessage = `El servicio ${service_name} fue creado con éxito`;

        return {successMessage,service};
    }
};

const getService = async (id) => {

    const service = await Service.findByPk(id);

    if(service){
        return service;
    }

};

const updatedService = async (id,serviceData) => {

    const existingService = await Service.findByPk(id);

    if(existingService){
        
        const updatedServices = await existingService.update(serviceData,{
            where:{
                id:id
            }
        });

        const succesMessage = `Servicio modificado con éxito`;

        return {succesMessage,updatedServices};
    }

};

const distroyService = async(id) => {
   
    const numDeleted = await Service.destroy({
        where: {
            id: id
        }
    })

}

module.exports = {getAllServices,postNewService,updatedService,getService,distroyService};