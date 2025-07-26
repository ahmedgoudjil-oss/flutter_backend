
//هذا الكود يتأكد بلي المستخدم راه عندو توكن، ويكون صحيح، ومن بعد يجيبلنا بياناتو (سواء كان زبون ولا بائع). إذا ماكانش التوكن ولا خطأ فيه، يمنعو من الوصول للـ API.

const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Vendor = require('../models/vendor');
// Middleware to authenticate user
const auth = async (req, res, next) => {
    try {
        //extract token from the Authorization header
        const token = req.header('x-auth-token');
        if (!token) return res.status(401).json({ msg: ' No authentication token provided.' });
        const verified = jwt.verify(token, "passwordKey");
        if (!verified) return res.status(401).json({ msg: 'Token verification failed.' });
        //find user by id
        const user = await User.findById(verified.id) || await Vendor.findById(verified.id);
        if (!user) return res.status(401).json({ msg: 'User not found.' });
        req.user = user;
        req.token = token;
        next();



    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(500).json({ msg: 'Server error during authentication.' });

    }
}

//vendor authentication middleware
//verify if the user is a vendor
const vendorAuth = async (req, res, next) => {
    try {
        //check if the user makes a request is vendor
     if (!req.user.role || !req.user.role== 'vendor') {
            return res.status(403).json({ msg: 'Access denied. Not a vendor.' });
        }
        next();
    } catch (error) {
        
        res.status(500).json({ error: error.message });
    }
};

module.exports = { auth, vendorAuth };
//export the auth middleware and vendorAuth middleware for use in other files