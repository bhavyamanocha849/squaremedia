const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
// const bcrypt = require("bcrypt");
// const User = require('../schemas/UserSchema');
const { login } = require('../controller/loginController');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
    res.status(200).render("login");
})
router.post("/", login);

module.exports = router;