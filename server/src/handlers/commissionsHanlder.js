
const {allCommisssions,updateCommission,totalCommissions} = require('../controllers/commissionsController');

const getCommissions = async(req,res) => {

    const {date} = req.body
  
    

    try {
        const commission = await allCommisssions(date);
     
        res.status(200).json(commission);
    } catch (error) {
        res.status(500).json({error:error.message});
    }

};

const getAllCommissions = async(req,res) => {
    try {
        const commissions = await totalCommissions();
        res.status(200).json(commissions);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
};

const patchCommission = async(req,res) => {

    const {id} = req.params;
    const {paid} = req.body;

    try {
        const updatedCommission = await updateCommission(id,paid);
        res.status(200).json(updatedCommission);
    } catch (error) {
        res.status(500).json({error:error.message});
    }

};

module.exports = {getCommissions,patchCommission,getAllCommissions}