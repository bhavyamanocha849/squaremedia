const { post, connect } = require('../routes/profileRoutes');
const  Post  = require('../schemas/PostSchema');
const User = require("../schemas/UserSchema");

async function getPosts(req,res,next){

    var searchObj = req.query;

    if(searchObj.followingOnly !== undefined){
        var followingOnly = searchObj.followingOnly == "true";

        if(followingOnly) {
            var objectIds = [];
            
            if(!req.session.user.following) {
                req.session.user.following = [];
            }

            req.session.user.following.forEach(user => {
                objectIds.push(user);
            })

            objectIds.push(req.session.user._id);
            searchObj.postedBy = { $in: objectIds };
        }

        delete searchObj.followingOnly;
    }
    var results = await getPostsOnCondition(searchObj);
    res.status(200).send(results);
}

async function deletePosts(req,res,next){
    // console.log("checking:::");
    var user = req.session.user._id;
    // console.log(user);
    var post = await Post.findById(req.params.id);
    // console.log(post.postedBy);
    if(post.postedBy === user){
        await Post.findByIdAndDelete(req.params.id)
        .then(()=>{
            res.sendStatus(202);
        })
        .catch((er)=>{
            console.log(er);
            res.sendStatus(400);
        })
    }
    else{
        console.log("Unable to delete other users posts");
        
        return res.sendStatus(400);

    }
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
        newPost = await User.populate(newPost,{path:"postedBy"});
        res.status(201).send(newPost);
    })
    .catch((err)=>{
        console.log(err);
        return res.sendStatus(400);
    })
}  

async function getPostsOnCondition(filter) {
    var results = await Post.find(filter)
    .populate("postedBy")
    .sort({ "createdAt": -1 })
    .catch(error => console.log(error))
    return results;
}

module.exports = {getPosts,deletePosts,createPost}