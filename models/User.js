const mongoose = require('mongoose');
// Defining the schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type:String,
    required:true
  },
  email: {
    type:String,
    required:true
  },
  password: {
    type:String,
    required:true
  },
  avatar: {
    type:String,
  },
  date: {
    type:Date,
    default:Date.now,
  },
  

});

// mongoose will model that schema with name users in database
module.exports = User = mongoose.model('users',UserSchema);