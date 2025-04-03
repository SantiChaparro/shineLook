const server = require('./src/server');
const { conn } = require('./src/db');
require('dotenv').config();
const clientLoader = require('./src/assets/funtions/loadClient');
const professionalLoader = require('./src/assets/funtions/loadProfessional');
const serviceLoader = require('./src/assets/funtions/loadservice');
const loadProfessionalService = require('./src/assets/funtions/loadProfessionalService');
const commissionsLoader = require('./src/assets/funtions/loadCommissions');
const PORT = process.env.PORT


conn.sync({ force: true }).then(() => {
    // conn.sync({ alter: true }).then(() => {


    server.listen(PORT, async () => {

        await clientLoader();
        await professionalLoader();
        await serviceLoader();
        // await commissionsLoader();

        console.log(`Listening to port ${PORT}`);
    });

}).catch(error => console.error(error))