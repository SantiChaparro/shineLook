const mockProfessional = require('../mocks/mockProfessionals.json');

const { Professional } = require('../../db');

const professionalLoader = async () => {

    const professional = mockProfessional.professionals.map((professional)=>{

        return {

            dni: professional.dni,
            name: professional.name,
            phone: professional.phone,
            mail: professional.mail,
            commission_percentage: professional.commission_percentage,
            rol: professional.rol,
            password: professional.password,
            services: professional.services

        }

    })

    const loadProfessional = await Professional.bulkCreate(professional);
    return loadProfessional;


};

module.exports = professionalLoader;