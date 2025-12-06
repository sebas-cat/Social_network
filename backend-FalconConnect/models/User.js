const mongoose = require('mongoose'); //Se utiliza para definir esquemas y modelos
const { Schema, model } = mongoose; // estrae esquema y modelo de moongose 
//Schema = Define la estrctura de los documentos 
// model = Crea los modelos en base al esquema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true, //Se utiliza para quitar los espacios sobrantes 
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  career: {
    code: { type: String },
    name: { type: String },
  },
  imageUrl: { type: String },
  biography: { type: String },
  location: { type: String },
  privacy: {
    profile: { type: String, default: 'public' }, // public | friends | private
    posts: { type: String, default: 'public' },
  },
  role: {
    type: String,
    default: 'student', // student | professor | admin...
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  password: {
  type: String,
  required: true
  },
}, {
  collection: 'users', //Cierra el esquema y define el nombre de la colección
});

module.exports = model('User', userSchema);
//Crea el modulo a partir del esquema 