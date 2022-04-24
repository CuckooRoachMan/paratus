const {Router}=require('express');
const router = Router();
const nodemailer = require('nodemailer');
const userdev = require('../models/professionalsModel');
const jwt = require('jsonwebtoken');

router.post('/api/verification',verifyToken, async (req, res) => {   
    try { 
        const { codigo } = req.body;
        let token = req.headers.authorization.split(' ')[1];
        if(Dev = await userdev.findOne({token})){  
            if(codigo==Dev.codigo){
                email = Dev.email; 
                await userdev.updateOne({email},{$set:{estado:"activo",codigo:""}});
                res.json({estado:'Hecho', type:'dev'});
            }else{
                res.json({estado:'Fallo'});
            }  
        }        
    } catch (error) {
        console.log(error)
        return res.status(401).json({estado:'Error'})
    }
});

router.get('/api/verification', async (req, res) => {  
    try {
        const userIv=req.query.user;
        const userContent=req.query.user1;
        const code=req.query.code;
        const hash={
            iv: userIv,
            content: userContent
        }
        const dec_email = decrypt(hash);
        if(User= await userdev.findOne({email:dec_email})){
            if(code==User.codigo){
                const token = jwt.sign({_id: User._id}, 'secretkey');
                await userdev.updateOne({email:dec_email},{$set:{estado:"activo",codigo:"",token}});
                res.json({estado:'Hecho', type:'dev', token});
            }else{
                res.json({estado:'codigo'});
            }

        }else{
            console.log('No existe usuario');
            res.json({estado:'usuario'});
        }      
    } catch (error) {
        console.log(error)
        return res.status(401).json({estado:'Error'})
    }
});

router.get('/api/resend-code',verifyToken, async (req, res) => {
    console.log('Hola')
    let token = req.headers.authorization.split(' ')[1];
    console.log(token)
    if (User = await userdev.findOne({token})){
        try {
            let token = req.headers.authorization.split(' ')[1];
            const User = await userdev.findOne({token});
            const email_l= User.email;
            const codigoS=User.codigo;

            /*INICIO ENVIO DE CORREO */
                const transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                    user: 'paratus.unah@gmail.com',
                    pass: '3-4N}%b*H^'
                    }  
                });
                const mailOptions = {
                    from: 'paratus.unah@gmail.com',
                    to: email_l,
                    subject: 'Codigo de Verificación Paratus',
                    html: "Gracias por unirse a Paratus<br> Para activar su cuenta puede ingrese el siguiente codigo en la pantalla de verificacion: <br><br><b>" + codigoS+"</b>"
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                        return res.json({estado:'email'});
                    } else {
                        return res.status(200).json({estado:'hecho', token});
                    }
                });
                /*FIN ENVIO DE CORREO*/ 

        } catch (error) {
            return res.status(401).json({estado:'Error'});
        }
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