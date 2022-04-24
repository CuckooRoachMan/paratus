const {Router}=require('express');
const router = Router();
const user = require('../models/usersModel');
const userdev = require('../models/professionalsModel');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcrypt-nodejs');

router.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const email_l =email.toLowerCase(); 

        //Verificación usuario profesional
        if(User = await userdev.findOne({email:email_l})){
            //comparando temporal pass
            if(User.temporal_pass!=""){
                if(bcrypt.compareSync(password, User.temporal_pass)){
                    if(User.estado =='inactivo') {
                        const token = User.token;
                        return res.status(200).json({estado:'inactivo',token:token, type:'dev'});
                    }else{
                        const token = User.token;
                        //await user.updateOne({email:email_l},{$set:{estado:"activo"}})
                        return res.status(200).json({estado:'temporal',token:token, type:'dev'});
                    }
                    //comparando pass
                }else if(bcrypt.compareSync(password, User.password)){
                    if(User.estado =='inactivo') {
                        const token = User.token;
                        await userdev.updateOne({email:email_l},{$set:{ temporal_pass:""}})
                        return res.status(200).json({estado:'inactivo',token:token, type:'dev'});
                    }else{
                        const token = User.token;
                        await user.updateOne({email:email_l},{$set:{ temporal_pass:""}})
                        return res.status(200).json({estado:'hecho', token:token, type:'dev'}); 
                    }
                }
                return res.json({estado:'password', type:'dev'})
    
            }
            if(bcrypt.compareSync(password, User.password)){
                if(User.estado =='inactivo') {
                    const token = User.token;
                    return res.status(200).json({estado:'inactivo',token:token, type:'dev'});
                }else {
                    const token = User.token;
                    return res.status(200).json({estado:'hecho',token:token, type:'dev'});  
                }
                  
            }else{
                return res.json({estado:'password', type:'dev'});
            }

        }
        
        if(User = await user.findOne({email:email_l})){   //Verificacion si es cliente
            //comparando temporal pass
            if(User.temporal_pass!=""){
                if(bcrypt.compareSync(password, User.temporal_pass)){
                    const token = User.token;
                    return res.status(200).json({estado:'temporal',token:token, type:'usuario'});
                    //comparando pass
                }else if(bcrypt.compareSync(password, User.password)){
                    const token = User.token;
                    await user.updateOne({email:email_l},{$set:{ temporal_pass:""}})
                    return res.status(200).json({estado:'hecho', token:token, type:'usuario'});   
        
                }
                return res.json({estado:'password', type:'usuario'})
    
            }
            if(bcrypt.compareSync(password, User.password)){
                const token = User.token;
                await user.updateOne({email:email_l})
                return res.status(200).json({estado:'hecho',token:token, type:'usuario'});     
            }else{
                return res.json({estado:'password', type:'usuario'});
            }

        }else{
            
            return res.json({estado:'email'});
        }   
    } catch (error) {
        console.log(error)
        res.json({estado:'Error'});       
    }
        
});


module.exports = router;