const {Schema, model} = require('mongoose');
const bcrypt = require ('bcrypt-nodejs');

const userSchema = new Schema({
    nombre: String,
    username: String,
    email: String,
    password: String,
    telefono: String,
    genero: String,
    //intentos:Number,
    picPerfil: String,
    token: String,
    temporal_pass:String,
    mesRegistro:Number,
    anioRegistro:Number
}, {
    timestamps: true
});
userSchema.index({email:1},{unique:true});

//Lectura de contraseñas encriptadas
/*userSchema.methods.compararPass = function (password, cb){ //cb = callback
    bcrypt.compare(password, this.password, (err, iguales)=>{
        if (err){
            return cb(err);
        }
        cb (null, iguales);
    })
}*/


module.exports=model('user', userSchema);