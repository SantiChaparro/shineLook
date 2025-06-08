
const {allCommisssions,updateCommission,totalCommissions} = require('../controllers/commissionsController');

const getCommissions = async(req,res) => {

    const {date , tenantId} = req.body
    console.log('date desde getCommissions handler', date);
    console.log('tenantId desde getCommissions handler', tenantId);
    
  
    

    try {
        const commission = await allCommisssions(date,tenantId);
     
        res.status(200).json(commission);
    } catch (error) {
        res.status(500).json({error:error.message});
    }

};

const getAllCommissions = async(req,res) => {
    const { tenantId } = req.params;
    try {
        const commissions = await totalCommissions(tenantId);
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