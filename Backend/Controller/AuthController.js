const userModel = require("../Models/userModel")
const bcrypt = require("bcrypt");
const jwt  = require("jsonwebtoken")

const registerUser = async(req, res)=>{
    const {email, password} = req.body;

    const salt = await bcrypt.genSalt(10);
    let pass = password.toString();
    const hashedPass = await bcrypt.hash(pass, parseInt(salt));
    req.body.password = hashedPass;

    const newUser = new userModel(req.body);

    try{
        const oldUser = await userModel.findOne({email});

        if(oldUser){
            return res.status(400).json({
                message: "this email is already exist please try with another email"
            })

        }

        const user = await newUser.save();
        const token = jwt.sign({email: user.email, id: user._id}, process.env.secretKey);
        res.status(200).json({user, token});
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const loginUser = async(req, res)=>{
    const {email, password} = req.body;
    try{
        const user = await userModel.findOne({email: email});

        if(user){
            const validity = await bcrypt.compare(password, user.password);
            if(!validity){
                res.status(404).json("sorry, please enter correct email and password");
            }else{
                const token = jwt.sign({email: user.email, id:user.id}, process.env.secretKey)
                user.token = token; // Update the token field
                await user.save(); 
                res.status(200).json({user, token});
            }

        }else{
            res.status(404).json("sorry, please enter correct email and passsword");
        }
    }catch(error){
        res.status(500).json({message: error.message})
    }
}

module.exports = { registerUser, loginUser };