const { where } = require('sequelize');
const { Commission, Professional, Service, Payment, Appointment,Client } = require('../db');

const totalCommissions = async (tenantId) => {
    console.log('tenantId desde totalCommissions controller', tenantId);

    const commissions = await Commission.findAll({
        where:{TenantId: tenantId},
        include: [
            {
                model: Professional,
                attributes: ['name', 'dni']
            },
            {
                model: Service,
                attributes: ['service_name', 'cost']
            }
            ,
            {
                model: Appointment,
                include: [
                    {
                        model: Payment
                    },

                    {
                        model: Professional, attributes: ['name']
                    },
                    {
                        model: Client, attributes:["name"]
                    }
                ]
            }
        ]
    });

    return commissions;

};


const allCommisssions = async (date,tenantId) => {

    const commissions = await Commission.findAll({
        where: {
            date: date,
            TenantId: tenantId
        },
        include: [
            {
                model: Professional,
                attributes: ['name', 'dni']
            },
            {
                model: Service,
                attributes: ['service_name', 'cost']
            },
            {
                model: Appointment,
                include: [
                    {
                        model: Payment
                    },
                    {
                        model: Professional, attributes: ['name']
                    },
                    {
                        model: Client, attributes:["name"]
                    }
                ]
            }
        ]
    });

    return commissions;
};



const updateCommission = async (id) => {

    const commissions = await Commission.findByPk(id);

    if (commissions) {
        await commissions.update({ paid: true })
    }

    return commissions;

};


module.exports = { allCommisssions, updateCommission, totalCommissions };
