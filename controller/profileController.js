// const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

function register(req, res, next){
    var payload =   {
        pageTitle:req.session.user.username,
        userLoggedIn:req.session.user,
        profileUser:req.session.user
    }
    res.status(200).render("profile",payload);
}

async function profile(req, res, next){
    var payload =await getPayload(req.params.username,req.session.user);
    if(payload===null){
        res.sendStatus(404);
    }
    res.status(200).render("profile",payload);
}

async function following (req,res,next){
    var payload = await getPayload(req.params.username,req.session.user);
    if(payload === null){
        return res.sendStatus(404);
    }

    payload.selectedTab = "following"
    res.status(200).render("followersAndFollowing",payload);
}

async function followers(req,res,next){
    var payload = await getPayload(req.params.username,req.session.user);
    if(payload === null){
        return res.sendStatus(404);
    }
    payload.selectedTab = "followers"
    res.status(200).render("followersAndFollowing",payload);
}

async function getPayload(username,userLoggedIn){
    var user= await User.findOne({username:username})
    if(user == null){
        return {
            pageTitle:"User not found",
            userLoggedIn:userLoggedIn,
            profileUser:null
        }
    }    
    return{
        pageTitle:user.username,
        userLoggedIn:userLoggedIn,
        profileUser:user
    }

}

module.exports = {register,profile,followers,following}

