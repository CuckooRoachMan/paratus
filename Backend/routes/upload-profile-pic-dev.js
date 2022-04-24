const { Router, json } = require('express');
const path = require('path');
const { unlink } = require('fs-extra');
const router = Router();
var multer = require("multer");
//var url = require ('../upload')
const userdev = require('../models/professionalsModel');
const jwt = require('jsonwebtoken');

var dir='';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        //Cambiar esta ruta por la que se desea utilizar
        //C:/Users/Administrator/Documents/Proyect_ISW/Backend/upload/dev
        cb(null, 'C:/Users/Administrator/Documents/Proyect_ISW/Backend/upload/dev')
    },
    filename: function(req, file, cb) {
        name=req.query.id + Date.now() + '.jpg';
        dir=name;
        cb(null, name)
    }
})



const upload = multer({
    storage: storage,
    limits: {
        // Setting Image Size Limit to 5MBs
        fileSize: 5000000
    },
    fileFilter(req, file, cb) {
        //Success
        cb(undefined, true)
    }
})

router.post('/api/upload-profile-pic-dev', upload.single('file'), async(req, res) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        const User = await userdev.findOne({token});
        //Se colocó la ruta especifica debido a que al usar la relativa presentaba inconsistencia
        const perfilPath = path.join(__dirname, "C:/Users/Administrator/Documents/Proyect_ISW/Backend/upload/dev", User.picPerfil);
            email = User.email;
            if(await userdev.updateOne({email},{$set:{picPerfil:dir}})){
                defaultPath=path.join(__dirname, "C:/Users/Administrator/Documents/Proyect_ISW/Backend/upload/dev/Default.png")
                if(perfilPath!=defaultPath){
                    unlink(perfilPath);
                }
            return res.json({estado:'Hecho'});
            }
        else{
            return res.json({estado:'Fallo'});
        }
    } catch (error) {
        console.log(error)
        return res.status(401).json({estado:'Error'})
    }

});

router.get('/api/profile-pic-dev',verifyToken, async (req, res) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        const User = await userdev.findOne({token});
        const imageName = User.picPerfil;
        const imagePath = path.join(__dirname, "../upload/dev", imageName)
        return res.sendFile(imagePath);
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
        console.log(e)
        return res.status(401).send('Unauhtorized Request');
    }
}


module.exports = router;
