const bcrypt = require("bcrypt");
const User = require('../schemas/UserSchema');

async function registerUser(req, res, next) {
    var firstName = req.body.firstName.trim();
    var lastName = req.body.lastName.trim();
    var username = req.body.username.trim();
    var email = req.body.email.trim();
    var password = req.body.password;

    var payload = req.body;

    if(firstName && lastName && username && email && password) {
        var user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render("register", payload);
        });

        if(user == null) {
            // No user found
            var data = req.body;
            data.password = await bcrypt.hash(password, 10);

            User.create(data)
            .then((user) => {
                //set session
                req.session.user = user;
                return res.redirect("/");
            })
        }
        else {
            // User found
            if (email == user.email) {
                payload.errorMessage = "Email already exists";
            }
            else {
                payload.errorMessage = "Username already exists";
            }
            res.status(200).render("register", payload);
        }
    }
    else {
        payload.errorMessage = "all fields should have valid inputs";
        res.status(200).render("register", payload);
    }
}

module.exports = {registerUser}