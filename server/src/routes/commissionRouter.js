const {Router} = require('express');

const {getCommissions,patchCommission,getAllCommissions} = require('../handlers/commissionsHanlder');

const commissionRouter = Router();
commissionRouter.get('/:tenantId',getAllCommissions)
commissionRouter.post('/',getCommissions);
commissionRouter.patch('/:id',patchCommission)


module.exports = commissionRouter;