const {Schema, model} = require('mongoose');
const bcrypt = require ('bcrypt-nodejs');

const professionalSchema = new Schema({
    nombre: String,
    //apellido:String,
    username: String,
    email: String,
    password: String,
    profesion: String,
    tecnologias: String,
    experiencia:String,
    telefono: String,
    genero: String,
    codigo: Number,
    estado: String,
    //intentos:Number,
    picPerfil: String,
    token: String,
    temporal_pass:String,
    mesRegistro:Number,
    anioRegistro:Number
}, {
    timestamps: true
});
professionalSchema.index({email:1},{unique:true});

module.exports=model('professional', professionalSchema);
