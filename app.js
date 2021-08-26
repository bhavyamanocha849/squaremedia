const express = require('express');
const app = express();
const port = 3232;
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const mongoose = require("./database");
const session = require("express-session");
const MongoStore = require('connect-mongo')(session);

const server = app.listen(port, () => console.log("Server listening on port " + port));

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "dattebayo",
    store: new MongoStore.create({
        url: process.env.MONGODB_URI, //YOUR MONGODB URL
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native' 
    }),
    resave: true,
    saveUninitialized: false
}))



// Page Handler Routes
const loginRoute = require('./routes/loginRoutes');
const registerRoute = require('./routes/registerRoutes');
const logoutRoute = require('./routes/logoutRoutes');
const profileRoutes = require('./routes/profileRoutes');

//api routes
const postsApi = require('./routes/api/posts')
const usersApi = require('./routes/api/users')

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout",logoutRoute);
app.use("/profile",middleware.requireLogin,profileRoutes)
app.use("/api/posts",postsApi);
app.use("/api/users",usersApi);

app.get("/", middleware.requireLogin, (req, res, next) => {
    var payload = {
        pageTitle: "Home",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
    }
    res.status(200).render("home", payload);
})