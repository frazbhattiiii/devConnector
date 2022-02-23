const express = require('express')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/api/users')
const posts = require('./routes/api/posts')
const profile = require('./routes/api/profile')
const passport = require('passport');


const app = express();
// Body parser middlware to have access to req.body and stuff like that
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())


// taking the key from config folder to connect to database
const db= require('./config/keys').mongoURI;

mongoose
 .connect(db)
 .then(()=>console.log("MongoDB conneceted Successfully"))
 .catch(err=>console.log(err.message))

// passport middleware
app.use(passport.initialize());
// passport config middleware we can use it in the whole application and it's for protecting routes(private routes)
require('./config/passport')(passport);


//use routes

app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);


const port = process.env.PORT || 5000

// listening the server on specified ports
app.listen(port, () =>console.log(`serverr running on port : ${port}`))
