const express = require('express');
const app = express();
const router = express.Router();
const bodyParser = require("body-parser")
const { userProfile, profile, following, followers } = require('../controller/profileController');

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", userProfile);
router.get("/:username",profile);
router.get("/:username/following",following);
router.get("/:username/followers",followers); 

module.exports = router;