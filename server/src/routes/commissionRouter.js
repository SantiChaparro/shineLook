const {Router} = require('express');

const {getCommissions,patchCommission,getAllCommissions} = require('../handlers/commissionsHanlder');

const commissionRouter = Router();
commissionRouter.get('/',getAllCommissions)
commissionRouter.post('/',getCommissions);
commissionRouter.patch('/:id',patchCommission)


module.exports = commissionRouter;