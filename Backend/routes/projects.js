const {Router}=require('express');
const router = Router();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require ('bcrypt-nodejs');

const project = require('../models/projectModel');
//const projectModel = require('../models/projectModel');

router.get('/api/projects', async(req, res)=>{
    console.log('peticion del backend');
    try{
        const proyecto = await project.find({});
        const Project = await project.countDocuments();
        console.log(project);
        return res.json({proyecto, Project});
    }catch(error){
        res.json({estado:'Error'});
        console.log('fallo')
    }
});

//obtener un proyecto
router.get('/api/prueba/:id', function (req, res) {
    project.find({_id:req.params.id}).then(resultado=>{
        res.send(resultado[0]);
        res.end();
    }).catch(error=>{
        res.send(error);
        res.end();
    });
});

module.exports = router;
