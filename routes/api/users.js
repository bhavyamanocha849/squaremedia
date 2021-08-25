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
    if(user == null){
        return res.statusCode(404);
    }

    //check if followers exist
    //then check if the followers arrays has the user
     
    var isFollowing = user.followers && user.followers.includes(req.session.users._id);

    res.status(200).send(isFollowing);   
})



module.exports = router;