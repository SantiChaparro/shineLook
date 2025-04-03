

const commissionsPerProfessional = (commissions) => {
    const commissionPerProfessional = [];

    commissions.forEach(commission => {
        const professionalName = commission.Professional?.name;
        const amount = commission.amount;
        const dni = commission.Professional.dni; // Obtener el DNI del profesional

        if (!commissionPerProfessional[professionalName]) {
            commissionPerProfessional[professionalName] = { total: 0, dni: dni }; // Incluir el DNI del profesional
        }

        commissionPerProfessional[professionalName].total += amount;
    });

    for (const key in commissionPerProfessional) {
        commissionPerProfessional[key].total = Math.round(commissionPerProfessional[key].total * 100) / 100;


    }

    return commissionPerProfessional;
};

export default commissionsPerProfessional;
