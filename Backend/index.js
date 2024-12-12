const express = require("express")
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const AuthRouter = require("./Router/AuthRoute.js");
const UserRouter  = require("./Router/UserRoute.js")
const PostRouter = require("./Router/PostRouter.js");

const MongoUrl = process.env.MongoUrl;

app.use(express.json());
app.use('/auth', AuthRouter);
app.use('/user',UserRouter);
app.use('/post', PostRouter);

mongoose.connect(MongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{console.log("database connected")})
.catch((error) => {
    console.log("------- mongo Error",error)
})





app.listen(process.env.PORT, ()=>{
    console.log(`server running at port ${process.env.PORT}`);
})

