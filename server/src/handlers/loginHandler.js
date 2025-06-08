const { validatePassword } = require('../controllers/loginController');
const { generateToken } = require('../assets/funtions/generateTokken');

const postPassword = async (req, res) => {

    const { dni, password } = req.body;
   


    try {

        const professional = await validatePassword({ dni, password });
        console.log('response desde handler',professional);
        

        if (professional) {

            const tokken =generateToken(professional)
            console.log(tokken);
            console.log(professional);
            

            if(professional.tenantOptions)
            {
                res.status(200).json({ tokken: tokken, tenants:professional.tenantOptions});
            }
            else{
                res.status(200).json({ tokken: tokken, tenants:professional.tenantId});
            }

            
        }


    } catch (error) {
        res.status(500).send({ error: error.message });
    }


};

module.exports = { postPassword };