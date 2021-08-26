const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const { registerUser } = require('../controller/registerController');
// const bcrypt = require("bcrypt");
// const User = require('../schemas/UserSchema');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    res.status(200).render("register");
})

router.post("/",registerUser);

module.exports = router;