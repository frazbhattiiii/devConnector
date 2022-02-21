const express = require('express')
const mongoose = require('mongoose');
const users = require('./routes/api/users')
const posts = require('./routes/api/posts')
const profile = require('./routes/api/profile')


const app = express();

const db= require('./config/keys').mongoURI;

mongoose
 .connect(db)
 .then(()=>console.log("MongoDB conneceted Successfully"))
 .catch(err=>console.log(err.message))

app.get('/',(req,res)=>res.send(hello))

//use routes

app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);


const port = process.env.PORT || 5000





app.listen(port, () =>console.log(`serverr running on port : ${port}`))
