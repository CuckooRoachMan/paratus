const {Router}=require('express');
const router = Router();
const user = require('../models/usersModel');
const userdev = require('../models/professionalsModel');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcrypt-nodejs');

router.post('/api/recover-password', verifyToken, async (req, res) => {
    try {
        const {contrasenaNueva1, contrasenaNueva2 } = req.body;
        if(contrasenaNueva1!=contrasenaNueva2){
            return res.json({estado:'password'});
        }
        let token = req.headers.authorization.split(' ')[1];
        console.log(token)
        //Usuario profesional
        if(UserDev = await userdev.findOne({token})){
            console.log ('recuperacion')
            const salt = bcrypt.genSaltSync();
            const hash= bcrypt.hashSync(contrasenaNueva1, salt);

            if(await userdev.updateOne({token},{$set:{password:hash}})){
                const UserDev = await userdev.findOne({token});
                if(await userdev.updateOne({token},{$set:{temporal_pass:""}}));
                return res.status(200).json({estado:'hecho', type:'usuario'});
            } 
        }
        
        //Usuario cliente
        if(User = await user.findOne({token})){
            const salt = bcrypt.genSaltSync();
            const hash= bcrypt.hashSync(contrasenaNueva1, salt);

            if(await user.updateOne({token},{$set:{password:hash}})){
                const User = await user.findOne({token});
                if(await user.updateOne({token},{$set:{temporal_pass:""}}));
                return res.status(200).json({estado:'hecho', type:'usuario'});
            } 
        }

    } catch (error) {
        console.log(error)
        
    }
        
        
});

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