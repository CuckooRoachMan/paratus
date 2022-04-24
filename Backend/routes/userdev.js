const {Router}=require('express');
const router = Router();
const userdev = require('../models/professionalsModel');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcrypt-nodejs');
//const { encrypt } = require('./functions');
const validator = require("email-validator");


//La funcion debe ser async para poder usar await
router.post('/api/signup-dev', async (req, res)=>{
    try {
        //guardar los valores de los datos recibidos en formato json
        const { nombre, username, email, password, vpassword,  profesion,
            tecnologias, experiencia, telefono, genero}= req.body;
        //Creando el objeto usuario usando el modelo en users.js
        const email_l =email.toLowerCase();
        //Validación del correo electronico recibido
        /*if (validator.validate(email_l)==false){
            return res.json({estado:'correo_invalido'})
        }*/
         //Comparacion contraseñas   
        if (password != vpassword){
            return res.json({estado:'password'})
        }

        if(email_l.match(/@unah.hn$/)){
            //creando codigo de validacion
            function getRandomInt(min, max) {
                result = Math.floor(Math.random() * (max - min)) + min;
                return result;
            }

             //Verificación de username no repetido
            if(UserR = await userdev.findOne({username:username})) {
                return res.json({estado: 'usuario_repetido'});     
            }

            /*VERIFICANDO SI EXISTE YA UN CORREO EN LA BASE*/
            if( UserR = await userdev.findOne({email:email_l})) {
                return res.json({estado: 'correo_repetido'});     
            } else {
                var codigo = getRandomInt(1,10000);
                var codigoS = codigo.toString().padStart(5,'0');
                    while(CodigoV=await userdev.findOne({codigo:codigoS})){
                        codigo=getRandomInt(1,10000);
                        codigoS = codigo.toString().padStart(5,'0');
                    }
                //encriptacion
                const salt = bcrypt.genSaltSync();
                const hash= bcrypt.hashSync(password, salt);
                /*GUARDADO EN LA BASE*/
                const imageName ="Default.png";
                //const imagePath = path.join(__dirname, "../../upload", imageName);
                mesRegistro=new Date().getMonth();
                anioRegistro=new Date().getFullYear();
                const newUser = new userdev ({nombre, username, email:email_l, password:hash, profesion,
                    tecnologias, experiencia, telefono, genero, codigo:codigoS, estado:"inactivo", 
                    picPerfil:imageName, token:"", temporal_pass:"",anioRegistro,mesRegistro});
                await newUser.save();
                console.log (newUser);
                const token = await jwt.sign({_id: newUser._id}, 'secretkey');
                await userdev.updateOne({email:email_l},{$set:{token:token}});
                
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

            }     
        }else{
            res.json({estado:'correo'});
            console.log('Su correo no es de la UNAH');
        }        
    } catch (error) {
        console.log(error)
        return res.status(401).json({estado:'Error'}) 
    }
            
    });


    router.get('/api/profile-dev',verifyToken, async (req, res) => {
        console.log('prueba')
        try {
            let token_l = req.headers.authorization.split(' ')[1];
            if(User= await userdev.findOne({token:token_l}, {_id:0})){
                console.log(User)
                return res.json({User});
            }        
        } catch (error) {
            console.log(error)
            return res.status(401).json({estado:'Error'})    
        }
    });
    
    router.get('/api/user-state',verifyToken, async (req, res) => { 
        try {
            let token_l = req.headers.authorization.split(' ')[1];
            if(User= await userdev.findOne({token:token_l})){
                if(User.estado=='inactivo'){
                    return res.json({estado:'inactivo'});
                }else{
                    return res.json({estado:'activo'})
                }
            }   
        } catch (error) {
            console.log(error)
            return res.status(401).json({estado:'Error'})      
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
            //console.log(e)
            return res.status(401).send('Unauhtorized Request');
        }
    }
    
module.exports = router;
