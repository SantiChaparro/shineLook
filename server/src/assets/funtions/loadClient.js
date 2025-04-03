const mockClient = require('../mocks/mockClients.json');


const { Client } = require('../../db');


const clientLoader = async () => {

    const client = mockClient.clients.map((client)=>{

        return {

            dni: client.dni,
            name: client.name,
            DateOfBirth: client.DateOfBirth,
            phone: client.phone,
            mail: client.mail
        }

    })

    const loadClient = await Client.bulkCreate(client);
    return loadClient;


};

module.exports = clientLoader;