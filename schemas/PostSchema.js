const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    //if retweet is to be added we will remove required true
    content:{type:String,trim:true,required:true},
    postedBy:{type:Schema.Types.ObjectId,ref:'User'},//unique id added to the collection by mongo
}, { timestamps: true });

var User = mongoose.model('Post', PostSchema);
module.exports = User;