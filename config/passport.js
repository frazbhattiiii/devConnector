const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const { Passport } = require('passport/lib');
const User = mongoose.model('users');
const keys = require('../config/keys');
// an empty object 
const opts={};
// Basic syntax of declaring passport
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
// Secret key from config file
opts.secretOrKey = keys.secretOrKey;
module.exports = passport =>{
  passport.use
  (new JwtStrategy(opts,(jwt_payload,done)=>{
   User.findById(jwt_payload.id)
   .then(user=>{
     if(user){
       return done(null, user);

     }
     return done(null,false);

   })
   .catch(err=>console.log(err))

  })
  );
}