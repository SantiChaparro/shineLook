const {Client}= require ('../db')

const getAllClients = async () => {

    const clients = await Client.findAll(
        {
            order: [['name', 'ASC']] 
        }
    );

    if(clients){
      
        return clients
    }else{
        throw new Error('No se encontraron clientes');
    }

};


const newClient = async (dni,name,DateOfBirth,phone,mail) => {

    const existingClient = await Client.findByPk(dni);

    if(existingClient){

        throw new Error('Cliente ya registrado');

    }else{

        const client = await Client.create({dni,name,DateOfBirth,phone,mail});

        if(client){
            const successMessage = `Cliente ${name} registrado con éxito`;
            return {successMessage,client};
        }

    }
};

const foundClient = async (dni) => {

    const client = await Client.findByPk(dni);

    // if(client){
        return client;
    // }

};


const updatedClient = async (clientData,dni) => {

    const existingClient = await Client.findByPk(dni);

    if(existingClient){

        const newClient =await existingClient.update(clientData,{
            where:{
                dni: dni
            }
        });

        const successMessage = `Cliente modificado con éxito`;

        return {successMessage,newClient};

    }

};


module.exports={getAllClients, newClient, updatedClient, foundClient}