const express = require('express');
const app = express();
const port = 3232;
const middleware = require('./middleware')
const path = require('path')
const bodyParser = require("body-parser")
const session = require("express-session");
const MongoStore = require('connect-mongo');

const server = app.listen(process.env.PORT, () => console.log("Server listening on port " + process.env.PORT));

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: "dattebayo",
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl: 14 * 24 * 60 * 60,
        autoRemove: 'native' 
    }),
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