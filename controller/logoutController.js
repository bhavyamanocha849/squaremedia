const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

function logout(req, res, next){
    if(req.session){
        req.session.destroy(()=>{
            res.redirect('/login');
        })
    }
}

module.exports = {logout};