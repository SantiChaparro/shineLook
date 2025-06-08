const { where } = require('sequelize');
const {Client,TenantClient}= require ('../db')

const getAllClients = async (tenantId) => {

    const clients = await TenantClient.findAll(
        {
            where: {TenantId: tenantId},
            include: {
                model: Client,
                attributes: ['dni', 'name', 'DateOfBirth', 'phone', 'mail']
            },
            order: [[Client, 'name', 'ASC']]
        }
    );

    if(clients){
      
        return clients
    }else{
        throw new Error('No se encontraron clientes');
    }

};




const newClient = async (dni, name, DateOfBirth, phone, mail, tenantId) => {
  // 1. Verificamos si ya existe el cliente
  const existingClient = await Client.findByPk(dni);

  if (existingClient) {
    // 2. Verificamos si ya está asociado al tenant
    const alreadyLinked = await TenantClient.findOne({
      where: {
        ClientDni: dni,
        TenantId: tenantId
      }
    });

    if (alreadyLinked) {
      throw new Error('El cliente ya registrado');
    }

    // 3. cliente existe pero no está asociado al tenant
    await TenantClient.create({
      ClientDni: dni,
      TenantId: tenantId
    });

    const successMessage = `Cliente registrado con éxito`;
    return { successMessage, client: existingClient };

  } else {
    // 4. Creamos el cliente y luego lo asociamos
    const client = await Client.create({ dni, name, DateOfBirth, phone, mail });

    await TenantClient.create({
      ClientDni: dni,
      TenantId: tenantId
    });

    const successMessage = `Cliente ${name} registrado y vinculado al tenant con éxito`;
    return { successMessage, client };
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