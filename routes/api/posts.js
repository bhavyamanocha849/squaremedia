const express = require('express');
const app = express();
const router = express.Router();

 
const bodyParser= require('body-parser');
const  Post  = require('../../schemas/PostSchema');
const User = require("../../schemas/UserSchema")
app.use(bodyParser.urlencoded({extended:false}));

router.get("/",async(req,res,next)=>{
    Post.find().populate("postedBy").sort({"createdAt":-1})
    .then(results=>{
        res.status(200).send(results);
    }).catch((err)=>{
        console.log(err);
        res.sendStatus(400);
    })
    
})

router.delete("/:id",(req,res,next)=>{
    Post.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.sendStatus(202);
    })
    .catch(er=>{
        console.log(er);
        res.sendStatus(400);
    })
})

router.post("/",async(req,res,next)=>{
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
    // res.status(200).send("it works"); 

})


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