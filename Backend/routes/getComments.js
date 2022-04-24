const {Router}=require('express');
const router = Router();
const jwt = require('jsonwebtoken');


const commentModel = require('../models/commentModel');
const comentario = require('../models/commentModel');

router.post('/api/get-comments', async(req, res)=>{
    console.log("Accedio backend Comentarios");
    //console.log(req.body.id);
    //console.log(comentario);
    try{
        const comment = await comentario.find({"id_proyecto":req.body.id});
        const countComments = await comentario.countDocuments();
        //console.log(comment);
        return res.json({comment, countComments});
    }catch(error){
        res.json({estado:'Error'});
        console.log('fallo al obtener comentarios')
    }
});

module.exports = router;
