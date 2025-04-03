const mockProfessionalService = require('../mocks/mockProfessionalService.json');
const { professionalService } = require('../../db');

const loadProfessionalService = async () => {
    const loadRelation = await Promise.all(mockProfessionalService.map(async (relation) => {
        relation.service.forEach(async (element) => {
            await professionalService.create({ ProfessionalDni: relation.professional, ServiceId: element });
        });
    }));
    
    return loadRelation;
};

module.exports = loadProfessionalService;