const express = require('express');
const router = express.Router();
const gravatar= require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// loading input validation

const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');
//load user model
const User = require('../../models/User');

// @route GET api/users/test
// @desc  tests post routes
// @access public route
router.get('/test',(req, res)=>{
  res.json({
    msg:"Users works!"
  })
})
// @route GET api/users/register
// @desc  register user
// @access public 
router.post('/register',(req,res)=>{
  const {errors,isValid} = validateRegisterInput(req.body);
  // Checking for the validation
  if(!isValid){
    return res.status(400).json(errors);

  }
  // mongoose method to find user by email and it will return a promise and variable of that id
User.findOne({ email: req.body.email })
.then(user=>{
  if(user){
    errors.email='Email already exits';
    // if the email is already available then 
    return res.status(400).json(errors);
  }
  else{
    // gravatar is for fetching the profile from email
    const avatar = gravatar.url(req.body.email,{
      // For the icon in the display
      s:'200',//Size
      r:'pg',//Rating
      d:'mm'//Default
    })
    const newUser = new User({
      // Adding the entries into new User json(for inserting in the database)
      name:req.body.name,
      email:req.body.email,
      avatar,
      password:req.body.password

    })
    // This is for hashing the passsword
    bcrypt.genSalt(10,(err,salt)=>{
    bcrypt.hash(newUser.password,salt,(err,hash)=>{
        if(err) throw err;
        newUser.password = hash;
        newUser.save()
          .then(user=>res.json(user))
          .catch(err=>console.log(err))
    })
    })
  }
})
})
// @route GET api/users/login
// @desc  logic user / Returning JWT Token
// @access public 

router.post('/login',(req,res)=>{
  const {errors,isValid} = validateLoginInput(req.body);
  // Checking for the validation
  if(!isValid){
    return res.status(400).json(errors);

  }
 
 
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email
  User.findOne({email})
    .then(user=>{
      if(!user){
        // if the user is not available
        errors.email='User not found!!';

      

      }
      // Check Password by bcrypt it will return a promise in form of true or false
      bcrypt.compare(password,user.password)
      .then(isMatch=>{
        if(isMatch){
          // user matched
          const payload ={
            id:user.id,
            name:user.name,
            avatar:user.avatar,

          }//Creating the payload
          // The .sign method will have some payload the information which we want to give to the token
          // It will also have a secret key for security purpose
          // after one hour 3600 this token will expire means user can't login
          jwt.sign(payload,keys.secretOrKey,{expiresIn: 3600},
          (err,token)=>{
            res.json({
              success:true,
              // Bearer is special type of protocol which we added in front of token
              token:'Bearer '+token
              
            })
          });
          

        }else{
          errors.password='Password incorrect';
          return res.status(400).json(errors);
          
          

        }

      })
    })
});
// @route GET api/users/current
// @desc  Returning current user
// @access Private
// This is for making the route private as it is not accessible for user without login
router.get('/current',passport.authenticate('jwt',{session:false}),(req,res)=>{
  res.json({
    id:req.user.id,
    email:req.user.email,
    name:req.user.name
  })
})



module.exports = router;
