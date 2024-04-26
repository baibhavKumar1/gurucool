const {Schema , model} = require('mongoose');

const userSchema = new Schema(
    {
        "name":String,
        "email":String,
        "password":String,
        "sessions":[String]
    },{ versionKey:false}
)

const UserModel = model('user',userSchema);

module.exports = UserModel