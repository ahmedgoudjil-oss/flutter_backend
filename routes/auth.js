const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authorRouter = express.Router();
 

authorRouter.post('/api/signup',async(req,res)=>{
try {
    const {fullName,email,password}= req.body;
    const existingEmail = await User.findOne({email});
    if(existingEmail){
        return res.status(400).json({msg:" Email Already exists "})
    }else{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        var user = new User ({fullName,email,password: hashedPassword});
        user = await user.save();
        res.json({user});
    }
    
} catch (e) {
    res.status(500).json({error:e.message});
    
}
});


//sign in api endpoint
authorRouter.post('/api/signin',async(req,res)=>{
try {
    const {email,password}= req.body;
const findUser = await User.findOne({email});
if(!findUser){ 
return res.status(400).json({msg:"User not found with this email"});

}else{
    const isMatch = await bcrypt.compare(password,findUser.password);
    if(!isMatch){
        return res.status(400).json({msg:"Incorrect password"});
    }else{
        const token = jwt.sign({id: findUser._id},"passwordKey");
         const {password, ...userWithoutPassword}= findUser._doc;

         res.json({token,user:userWithoutPassword} );

    }


}
    
} catch (e) {
    res.status(500).json({error:e.message});
}

});
// update user state , city, locality
authorRouter.put('/api/users/:id',async(req,res)=>{
try {
    const {id} = req.params;
    const {state, city, locality} = req.body;
    // Find the user by ID and update the state, city, and locality
    const updatedUser = await User.findByIdAndUpdate(
        id,
        { state, city, locality },
        { new: true } // Return the updated document
    );
    if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json(updatedUser);


}
    
 catch (e) {
    res.status(500).json({error:e.message});
}

});

// ... existing code ...

// Fetch all users, excluding password
authorRouter.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude password field
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ... existing code ...
module.exports = authorRouter;