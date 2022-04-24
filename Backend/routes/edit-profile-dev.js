const {Router}=require('express');
const router = Router();
const userdev = require('../models/professionalsModel');
const jwt = require('jsonwebtoken');

router.post('/api/edit-profile-dev', verifyToken, async (req, res) => {
    
    try {  
        const {tecnologias, experiencia, telefono} = req.body;
        let token = req.headers.authorization.split(' ')[1]; 
        const User = await userdev.findOne({token});
        if(User.estado=='inactivo'){
            return res.json({estado:'inactivo'});
        }
        email = User.email; 
        console.log(email)
        if(await userdev.updateOne({email},{$set:{tecnologias:tecnologias, experiencia:experiencia, telefono:telefono}})){
            res.json({estado:'Hecho'});
        }
        else{
            res.json({estado:'Fallo'});
        }       
    } catch (error) {
        console.log(error);
        return res.status(401).send('Error'); 
    }
});


//verificar token
async function verifyToken(req, res, next) {
	try {
		if (!req.headers.authorization) {
			return res.status(401).send('Unauhtorized Request');
		}
		let token = req.headers.authorization.split(' ')[1];
		if (token === 'null') {
			return res.status(401).send('Unauhtorized Request');
		}

		const payload = await jwt.verify(token, 'secretkey');
		if (!payload) {
			return res.status(401).send('Unauhtorized Request');
        }
        req.userId = payload._id;
		next();
	} catch(e) {
		console.log(e)
		return res.status(401).send('Unauhtorized Request');
	}
}

module.exports = router;