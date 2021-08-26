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
        mongoose.connect(process.env.MONGODB_URI)
        .then(() => {
            console.log("Connected to DB");
        })
        .catch((err) => {
            console.log("connection failed to DB" + err);
        })
    }
}

module.exports = new Database();