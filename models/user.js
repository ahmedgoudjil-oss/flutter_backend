const mongoose = require('mongoose');
  const userSchema = mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        trim : true,
    },
    email:{
        type: String,
        required: true,
        trim : true,
        validate : {
            validator :(value)=>{
                const result = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return result.test(value);
            
            },
            message : "enter a valid email adress",

        },
    },
    password:{
        type: String,
        required: true,
        trim : true,
        validate : {
            validator :(value)=>{
                //check if password is at least 8 char
                return value.length>=8;

            
            },
            message : "password must be at least 8 character"

        },
    },
    state:{
        type: String,
       default:"",
        
    },
    city:{
        type: String,
        default:"",
        
    },
    locality:{  
        type: String,
        default:"",
    },
    

  });
  const User =mongoose.model("User",userSchema);
  module.exports= User;