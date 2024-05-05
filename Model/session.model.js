const {Schema , model} = require('mongoose');

const sessionSchema = new Schema(
    {
        astrologer:String,
        user:String,
        startedAt:{
            type:Date,
            default:Date.now
        },
        endedAt:Date,
        query:String
    },{versionKey:false}
)

const SessionModel = model('session',sessionSchema);

module.exports = SessionModel