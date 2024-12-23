const postModel = require("../Models/postModel");
const mongoose = require("mongoose");
const userModel = require("../Models/userModel");
const { post } = require("../Router/AuthRoute");

const createPost = async(req,res) => {
    const newPost = new postModel(req.body);
     try{
        await newPost.save();
        res.status(200).json(newPost)
     }catch(error){
        res.status(500).json(error)
     }
}

const getPost = async(req,res)=>{
    const id = req.params.id

    try{
        const post = await postModel.findById(id);
        res.status(200).json(post)
    }catch(error){
        res.status(500).json(error);
    }
}

const updatePost = async(req, res)=> {
    const postId = req.params.id;
    const {userId} = req.body

    try{
        const post = await postModel.findById(postId);
        if(post.userId === userId){
            await postModel.updateOne({$set: req.body})
            res.status(200).json("Post updated successfully")
        }else{
            res.status(403).json("action forbidden")
        } 
    }catch(error){
        res.status(500).json(error)
        // console.log(error)
    }
}

const deletePost = async(req, res )=>{
    const id = req.params.id;
    const {userId} = req.body;

    try{
        const post = await postModel.findById(id)
        if(post.userId === userId){
            await post.deleteOne();
            res.status(200).json("post deleted successfully");

        }else{
            res.status(403).json("Action forbidden")
        }
    }catch(error){
        res.status(403).json(error);
    }
}

const likeDislikePost = async(req, res) =>{
    const id = req.params.id;
    const {userId} = req.body;
    // console.log(userId);
    try{
        const post = await postModel.findById(id);
        // console.log(post);
        if(!post.likes.includes(userId)){
            // console.log("--inner--")
            await post.updateOne({$push: {likes: userId}})
            res.status(200).json("post liked")
        }else{
            await post.updateOne({$pull : {likes: userId}})
            res.status(200).json("post dislike")
        }
    }catch(error){
        res.status(500).json(error)
    }
}

const timeline = async (req, res) =>{
    const userId = req.params.id;
    try{
        const currentUserPosts = await postModel.find({userId: userId});
        const followingUserPosts = await userModel.aggregate(
            [
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup:{
                        from: "posts",
                        localField: "following",
                        foreignField: "userId",
                        as: "followingUserPosts" 
                    }
                },
                {
                    $project:{
                        followingUserPosts: 1,
                        _id: 0
                    }
                }
            ]
        )
        res.status(200).json(currentUserPosts.concat(...followingUserPosts[0].followingUserPosts).sort((a,b)=>{
            return b.createAt - a.createAt;
        }))

    }catch(error){
        res.status(500).json(error)
    }
}

module.exports = {createPost, getPost, updatePost, deletePost, likeDislikePost, timeline}; 