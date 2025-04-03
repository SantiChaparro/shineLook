const mockCommissions = require('../mocks/mockCommissions.json');
const { Commission , Professional , Service } = require('../../db');


const commissionsLoader = async()=> {

    const commission = mockCommissions.commissions.map((commission)=>{

        return {

            date: commission.date,
            amount: commission.amount,
            category: commission.category,
            paid: commission.paid

        }

    })

    const loadCommissions = await Commission.bulkCreate(commission);

    const totalCommissions = await Commission.findAll();
    const professionalIds = (await Professional.findAll()).map((professional) => professional.dni);
    const serviceIds =(await Service.findAll()).map((service) => service.id);


    

    totalCommissions.map(async(commission)=>{
        const randomServiceId = serviceIds[Math.floor(Math.random() * serviceIds.length)];
        const randomProfessionalId = professionalIds[Math.floor(Math.random() * professionalIds.length)];
        await commission.setProfessional(randomProfessionalId);
        await commission.setService(randomServiceId);
    })

};

module.exports = commissionsLoader;