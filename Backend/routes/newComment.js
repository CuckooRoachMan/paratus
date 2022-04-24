const {Router}=require('express');
const router = Router();
const user = require('../models/usersModel');
const Comment = require('../models/commentModel');

router.post('/api/proyect-comments-editor', async (req, res)=>{
    console.log("backend access to comment editor route");
    let token = req.headers.authorization.split(' ')[1];
    //console.log (token);
    try {
      if (User = await user.findOne({token})){
        const comment = new Comment({
            email: User.email,
            nombre:User.username,
            cuerpo: req.body.cuerpo,
            fecha_creacion: new Date(Date.now()).toISOString(),
            id_proyecto: req.body.id_proyecto,
            id_usuario: User._id
          });
          console.log(comment);
        await comment.save();

        return res.json({estado:"CommentSuccess"});
      }

    } catch (error) {
        console.log(error)
        return res.status(401).json({estado:'Error'});
    }
    });


module.exports = router;
