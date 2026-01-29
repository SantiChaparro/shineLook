const commissionsPerProfessional = (commissions) => {
    if (!Array.isArray(commissions)) commissions = [];

    const commissionPerProfessional = {};

    commissions.forEach((commission) => {
        const professionalName = commission.Professional?.name;
        const amount = commission.amount || 0;
        const dni = commission.Professional?.dni;

        if (!commissionPerProfessional[professionalName]) {
            commissionPerProfessional[professionalName] = { total: 0, dni: dni };
        }

        commissionPerProfessional[professionalName].total += amount;
    });

    for (const key in commissionPerProfessional) {
        commissionPerProfessional[key].total =
            Math.round(commissionPerProfessional[key].total * 100) / 100;
    }

    return commissionPerProfessional;
};

export default commissionsPerProfessional;
