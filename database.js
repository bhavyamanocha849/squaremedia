const mongoose = require("mongoose");
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useUnifiedTopology', true);
const {dbPass} = require('./config/dbpass');

class Database {

    constructor() {
        this.connect();
    }

    connect() {
        mongoose.connect("mongodb+srv://bhavya849:"+dbPass.pass+"@cluster0.8ww6q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
        .then(() => {
            console.log("Connected to DB");
        })
        .catch((err) => {
            console.log("connection failed to DB" + err);
        })
    }
}

module.exports = new Database();