const  Post  = require('../schemas/PostSchema');
const User = require("../schemas/UserSchema");

async function getPosts(req,res,next){
    Post.find().populate("postedBy").sort({"createdAt":-1})
    .then(results=>{
        res.status(200).send(results);
    }).catch((err)=>{
        console.log(err);
        res.sendStatus(400);
    })
    
}

async function deletePosts(req,res,next){
    // if(isDeleted === null){
    //     console.log('User not found');
    //     return res.sendStatus(404);
    // }
    // 
    await Post.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.sendStatus(202);
    })
    .catch((er)=>{
        console.log(er);
        res.sendStatus(400);
    })
}

async function createPost(req,res,next){
    if(!req.body.content){
        return res.sendStatus(400);
    }
    var postData = {
        content:req.body.content,
        postedBy:req.session.user
    }

    Post.create(postData)
    .then(async(newPost)=>{
        //populate manually
        newPost = await User.populate(newPost,{path:"postedBy"});
        // console.log(newPost);
        //201:resource created succesfully
        res.status(201).send(newPost);
    })
    .catch((err)=>{
        console.log(err);
        return res.sendStatus(400);
    })
}  

module.exports = {getPosts,deletePosts,createPost}