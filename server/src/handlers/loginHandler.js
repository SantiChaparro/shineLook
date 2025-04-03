const { validatePassword } = require('../controllers/loginController');
const { generateToken } = require('../assets/funtions/generateTokken');

const postPassword = async (req, res) => {

    const { dni, password } = req.body;
   


    try {

        const professional = await validatePassword({ dni, password });

        if (professional) {

            const tokken = generateToken(professional)

            res.status(200).json({ tokken: tokken, professional: professional });
        }


    } catch (error) {
        res.status(500).send({ error: error.message });
    }


};

module.exports = { postPassword };