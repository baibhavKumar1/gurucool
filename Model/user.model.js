const {Schema , model} = require('mongoose');

const userSchema = new Schema(
    {
        name:String,
        email:String,
        password:String,
        sessions: [{
            type: Schema.Types.ObjectId,
            ref: 'Session'
          }]
    },{ versionKey:false}
)

const UserModel = model('user',userSchema);

module.exports = UserModel