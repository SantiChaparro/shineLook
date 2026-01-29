const {Router} = require('express');
const {getRating, getUrlRating, submitRatingHandler } = require('../handlers/ratingHandler'); 
const ratingRouter = Router();


ratingRouter.get('/dataBaseRating',getRating);
ratingRouter.get('/urlRating',getUrlRating);
// Redirigir desde WhatsApp a la vista del frontend
ratingRouter.get('/confirm-rating', (req, res) => {
    const { appointmentId, tenantId, professionalDni, score } = req.query;
    const frontendUrl = process.env.REACT_APP_FRONT_URL || process.env.TUNNEL_URL || 'http://localhost:3000';
    res.redirect(`${frontendUrl}/confirm-rating?appointmentId=${appointmentId}&tenantId=${tenantId}&professionalDni=${professionalDni}&score=${score}`);
});
ratingRouter.get("/submitRating", submitRatingHandler);
ratingRouter.post("/submitRating", submitRatingHandler);


module.exports = ratingRouter;