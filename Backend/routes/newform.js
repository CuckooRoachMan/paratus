const {Router}=require('express');
const router = Router();
const user = require('../models/usersModel');
const Project = require('../models/projectModel');

router.post('/api/nuevo-proyecto', async (req, res)=>{

    let token = req.headers.authorization.split(' ')[1];
    console.log (token);
    try {
      if (User = await user.findOne({token})){
        const project = new Project({
            email:User.email,
            titulo: req.body.titulo ,
            visibilidad: req.body.visibilidad,
            descripcion: req.body.descripcion ,
            presupuesto: req.body.presupuesto ,
            timeframe: req.body.timeframe ,
            roles:req.body.roles,
            herramientas: req.body.herramientas
          });
          console.log(project);
        await project.save();

        return res.json({estado:"ProjectSuccess"});
      }

    } catch (error) {
        console.log(error)
        return res.status(401).json({estado:'Error'});
    }
    });


module.exports = router;
