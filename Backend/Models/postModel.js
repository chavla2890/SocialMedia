const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    desc:{
        type: String
    },
    likes:[],
    images: String
},{timestaps: true})

const postModel = mongoose.model("posts", postSchema);
module.exports = postModel;