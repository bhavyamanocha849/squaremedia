const express = require('express');
const app = express();
const router = express.Router();

 
const bodyParser= require('body-parser');
const  Post  = require('../../schemas/PostSchema');
const User = require("../../schemas/UserSchema");
const { getPosts, deletePosts, createPost } = require('../../controller/postController');
app.use(bodyParser.urlencoded({extended:false}));

router.get("/",getPosts);

router.delete("/:id",deletePosts)

router.post("/", createPost) // res.status(200).send("it works"); )


// async function getPosts(filter) {
//     var results = await Post.find(filter)
//     .populate("postedBy")
//     .populate("retweetData")
//     .populate("replyTo")
//     .sort({ "createdAt": -1 })
//     .catch(error => console.log(error))

//     results = await User.populate(results, { path: "replyTo.postedBy"})
//     return await User.populate(results, { path: "retweetData.postedBy"});
// }

module.exports = router;