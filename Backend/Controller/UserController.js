const userModel = require("../Models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const getAllUser = async(req, res)=>{
    try{
        let users = await userModel.find();
        users = users.map((user)=>{
            const{password, ...otherDetails} = user._doc;
            return otherDetails;
        })
        res.status(200).json(users);
    }catch(error){
        res.status(500).json(error);
    }
}

const getUser = async(req, res)=>{
    const id = req.params.id;
    try{
        const user = await userModel.findById(id);
        if(user){
            const {password, ...otherdetails} = user._doc;
            res.status(200).json(otherdetails);
        }else{
            res.status(404).json("please, try again it it invalid user")
        }
    }catch(error){
        res.status(500).json(error)
    }
}

const updateUser = async(req, res)=>{
    // console.log("1")
    const id = req.params.id;
    // console.log("2")
    const {_id, password} = req.body;
    // console.log("3")
    if(id === _id){
        // console.log("4")
        if(password){
            // console.log("5")
            const salt = await bcrypt.genSalt(10);
            // console.log("6")
            let pass = password.toString();
            // console.log("7")
            req.body.password = await bcrypt.hash(pass, salt)
            // console.log("8")
        }
        try{
            const user = await userModel.findByIdAndUpdate(id, req.body, {new: true});

            const token = jwt.sign(
                {email: user.email, id: user.id},
                process.env.secretKey
            );
            res.status(200).json({user, token})
        }catch{
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("Access Denied! You can only update your own profile")
    }

}

const deleteUser = async(req, res)=>{
    const id = req.params.id;
    const {_id, currentUserAdminStatus} =req.body;
    if(_id === id || currentUserAdminStatus){
        try{
            await userModel.findByIdAndDelete(id);
            res.status(200).json("User Delete Succussfully");
        }catch (error){
            res.status(500).json(error)
        }
    }else{
        res.status(403).json("Access Denied! You can only update your own profile");
    }
}

const followUser = async(req, res) =>{
    const id = req.params.id;
    const { _id } = req.body;
    if(id === _id){
        res.status(403).json("Action forbidden")
    }else{
        try{
            const followUser = await userModel.findById(id);
            const followingUser = await userModel.findById(_id);
            if(!followingUser.followers.includes(_id)){
                await followUser.updateOne({$push:{ followers: _id}})
                await followingUser.updateOne({$push:{ following: id}})
                res.status(200).json("User Followed")

            }else{
                res.status(403).json("you are already folloeing that user");

            }
        }catch(error){
            res.status(500).json(error)
        }
    }
}

const unFollowUser = async(req, res)=>{
    const id = req.params.id;
    const {_id} = req.body;
    if(id === _id){
        res.status(403).json("Action forbidden")
    }else{
        try{
            const followUser = await userModel.findById(id);
            const followingUser = await userModel.findById(_id);

            if(followUser.followers.includes(_id)){
                await followUser.updateOne({$pull : {followers: _id}})
                await followingUser.updateOne({$pull: {following: id}})
                res.status(200).json("User Unfollowed")
            }else{
                res.status(403).json("you are not followed by you")
            }
        }catch(error) {
            res.status(500).json(error)
        }
    }  
}


module.exports = {getAllUser, getUser, deleteUser, updateUser, followUser,  unFollowUser};// , ,