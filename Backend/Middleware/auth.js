const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.secretKey;
const auth = async (req, res, next) => {
    try{
        const token = req.headers.authorization?.split(" ")[1];
        console.log(token); 
        if(token) {
            const decoded = jwt.verify(token, secret);
            console.log(decoded);
            req.body._id = decoded?.id
        }
        next();
    }catch(error){
        console.log(error);
        return res.status(403).json({message: "Invalid or expired token"});
    }
};

module.exports = auth;