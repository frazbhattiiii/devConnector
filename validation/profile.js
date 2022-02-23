const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validProfileInput(data){
  let errors ={};
  // The validator methods only take string so setting that to empty string
  data.handle = !isEmpty(data.handle) ? data.handle : '';

  data.status = !isEmpty(data.status) ? data.status : '';
  data.skills = !isEmpty(data.skills) ? data.skills : '';

if(!Validator.isLength(data.handle,{min:2,max:40})){
  errors.handle ='Handle needs to between 2 and 4 characters!!';

}
if(Validator.isEmpty(data.handle)){
  errors.handle ='Profile handle required!'
}
if(Validator.isEmpty(data.skills)){
  errors.skills ='skills required!'
}
if(Validator.isEmpty(data.status)){
  errors.status ='Status Field required!'
}
if(!isEmpty(data.website)){
if(!Validator.isURL(data.website)){
  errors.website ='Not a valid url!'
}
}
if(!isEmpty(data.youtube)){
if(!Validator.isURL(data.youtube)){
  errors.youtube ='Not a valid url!'
}
}
if(!isEmpty(data.linkedin)){
if(!Validator.isURL(data.linkedin)){
  errors.linkedin ='Not a valid url!'
}
}
if(!isEmpty(data.instagram)){
if(!Validator.isURL(data.instagram)){
  errors.instagram ='Not a valid url!'
}
}


 
  return{
    errors,
    isValid:isEmpty(errors)
  }
}