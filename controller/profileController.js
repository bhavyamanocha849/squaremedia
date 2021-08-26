const User = require('../schemas/UserSchema');

function userProfile(req, res, next){
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
        user = await User.findById(username);
        if(user == null){
            return {
                pageTitle:"User not found",
                userLoggedIn:userLoggedIn,
                userLoggedInJs:JSON.stringify(userLoggedIn)
            }
        }
    }    
    return{
        pageTitle:user.username,
        userLoggedIn:userLoggedIn,
        userLoggedInJs:JSON.stringify(userLoggedIn),
        profileUser:user
    }

}

module.exports = {userProfile,profile,followers,following}

