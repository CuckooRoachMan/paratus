const { Router, json } = require('express');
const path = require('path');
const { unlink } = require('fs-extra');
const router = Router();
var multer = require("multer");
//var url = require ('../upload')
const user = require('../models/usersModel');
const jwt = require('jsonwebtoken');

var dir='';
//../routes/upload
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        //Cambiar esta ruta por la que se desea utilizar
        cb(null, 'C:/Users/Administrator/Documents/Proyect_ISW/Backend/upload')
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



const dev = multer({
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


router.get('/api/profile-pic',verifyToken, async (req, res) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        const User = await user.findOne({token});
        const imageName = User.picPerfil;
        const imagePath = path.join(__dirname, "../upload", imageName)
        return res.sendFile(imagePath);
    } catch (error) {
        console.log(error)
        return res.status(401).json({estado:'Error'})
    }
});


const usersModel = require('../models/usersModel');


router.post('/api/profile-pic-comments',verifyToken, async (req, res) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        //const User = await user.findOne({token});
        console.log('Id de usario para comm:');
        console.log(req.body.id_usuario);
        const User = await user.findOne({_id:req.body.id_usuario});  //ObjectId(req.body.id_usario)
        console.log(User.picPerfil);
        const countusers = await user.countDocuments();
        const imageName =User.picPerfil;
        const imagePath = path.join(__dirname, "../upload", imageName)
        console.log(imagePath);
        return res.sendFile(imagePath);
    } catch (error) {
        console.log(error)
        return res.status(401).json({estado:'Error'})
    }
});


router.post('/api/upload-profile-pic', upload.single('file'), async(req, res) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        const User = await user.findOne({token});
        const perfilPath = path.join(__dirname, "/home/jamz/Paratus/Proyect_ISW/Backend/upload/", User.picPerfil);
            email = User.email;
            if(await user.updateOne({email},{$set:{picPerfil:dir}})){
                defaultPath=path.join(__dirname, "/home/jamz/Paratus/Proyect_ISW/Backend/upload/Default.PNG")
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

router.get('/api/profile-pic',verifyToken, async (req, res) => {
    try {
        let token = req.headers.authorization.split(' ')[1];
        const User = await user.findOne({token});
        const imageName = User.picPerfil;
        const imagePath = path.join(__dirname, "../upload", imageName)
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
