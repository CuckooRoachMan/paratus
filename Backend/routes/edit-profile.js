const {Router}=require('express');
const router = Router();
const user = require('../models/usersModel');
const jwt = require('jsonwebtoken');

router.post('/api/edit-profile', verifyToken, async (req, res) => {
    
    try {  
        const {telefono} = req.body;
        let token = req.headers.authorization.split(' ')[1]; 
        const User = await user.findOne({token});

        email = User.email; 
        console.log(email)
        if(await user.updateOne({email},{$set:{telefono:telefono}})){
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