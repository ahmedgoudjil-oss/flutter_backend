const express = require('express');
const Vendor = require('../models/vendor');
const vendorRouter = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


vendorRouter.post('/api/vendor/signup',async(req,res)=>{
try {
    const {fullName,email,password}= req.body;
    const existingEmail = await Vendor.findOne({email});
    if(existingEmail){
        return res.status(400).json({msg:" Vendor with same Email Already exists "})
    }else{
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        let vendor = new Vendor ({fullName,email,password: hashedPassword});
        vendor = await vendor.save();
        res.json({vendor});
    }
    
} catch (e) {
    res.status(500).json({error:e.message});
    
}
});
//sign in api endpoint
vendorRouter.post('/api/vendor/signin',async(req,res)=>{
try {
    const {email,password}= req.body;
const findUser = await Vendor.findOne({email});
if(!findUser){ 
return res.status(400).json({msg:"Vendor not found with this email"});

}else{
    const isMatch = await bcrypt.compare(password,findUser.password);
    if(!isMatch){
        return res.status(400).json({msg:"Incorrect password"});
    }else{
        const token = jwt.sign({id: findUser._id},"passwordKey");
         const {password, ...vendorWithoutPassword}= findUser._doc;

         res.json({token,vendor:vendorWithoutPassword} );

    }


}
    
} catch (e) {
    res.status(500).json({error:e.message});
}


});

// Fetch all vendors, excluding password
vendorRouter.get('/api/vendors', async (req, res) => {
  try {
    const vendors = await Vendor.find().select('-password'); // Exclude password field
    res.json(vendors);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
   
module.exports= vendorRouter;
