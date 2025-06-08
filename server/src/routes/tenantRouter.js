const {Router} = require('express');
const {postTenant} = require('../handlers/tenantHandler')

const tenantRouter = Router();
tenantRouter.post('/newTenant',postTenant)

module.exports = tenantRouter;