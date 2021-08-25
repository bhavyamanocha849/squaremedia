const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');
const { findOne } = require('../schemas/UserSchema');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    var payload =   {
        pageTitle:req.session.user.username,
        userLoggedIn:req.session.user,
        profileUser:req.session.user
    }
    res.status(200).render("profile",payload);
})

router.get("/:username", async(req, res, next) => {
    var payload =await getPayload(req.params.username,req.session.user);
    res.status(200).render("profile",payload);

})

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

module.exports = router;