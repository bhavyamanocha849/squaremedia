const express = require('express');
const app = express();
const router = express.Router();

const bodyParser= require('body-parser');
const  Post  = require('../../schemas/PostSchema');
const User = require("../../schemas/UserSchema")
app.use(bodyParser.urlencoded({extended:false}));

router.put("/:userId/follow",async(req,res,next)=>{
    var userID = req.params.userId;

    var user = await User.findById(userID);
    console.log(user);
    if(user == null){
        return res.statusCode(404);
    }

    //check if followers exist
    //then check if the followers arrays has the user
     
    var isFollowing = user.followers && user.followers.includes(req.session.user._id);
    var option = isFollowing ?"$pull":"$addToSet";
    req.session.user =  await User.findByIdAndUpdate(req.session.user._id,{[option]:{following:userID}},{new:true})
    .catch(er=>{
        console.log(er);
        res.sendStatus(400);
    })

    User.findByIdAndUpdate(userID,{[option]:{followers:req.session.user._id}}) 
    .catch(er=>{
        console.log(er);
        res.sendStatus(400);
    })
    
    res.status(200).send(req.session.user);
})

router.get("/current",async(req,res,next)=>{
    var user = await User.findById(req.session.user._id);
    console.log("user"+user);
    if(user === null){
        console.log();
        return res.sendStatus(400);
    }
    return res.status(200).send(user);
})

router.get("/:userId/following",(req,res,next)=>{
    User.findById(req.params.userId)
    .populate("following")
    .then((results)=>{
        console.log(results);
        res.status(200).send(results);
    })
    .catch((er)=>{
        console.log(er);
        res.sendStatus(400);
    })
});


router.get("/:userId/followers",async(req,res,next)=>{
    User.findById(req.params.userId)
    .populate("followers")
    .then((results)=>{
        res.status(200).send(results);
    })
    .catch((er)=>{
        console.log(er);
        res.sendStatus(400);
    })
});


module.exports = router;