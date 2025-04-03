const {Router} = require('express');
const  {postPassword}  = require('../handlers/loginHandler'); 
const loginRouter = Router();


loginRouter.post('/',postPassword)



module.exports = loginRouter;