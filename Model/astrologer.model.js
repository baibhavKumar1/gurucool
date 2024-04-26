const {Schema , model} = require('mongoose');

const astrologerSchema = new Schema(
    {
        "name":String,
        "email":String,
        "password":String,
        "activeSessions":[String],
        "flow":Number,
        "isBooked":{
            type:Boolean,
            default:false
        },
        "rating":{
            type:Number,
            enum:{
                values: [1, 2, 3, 4, 5],
                message: 'Rating must be between 1 and 5'
            }
        }
    },{versionKey:false}
)

const AstrologerModel = model('astrologer',astrologerSchema);

module.exports = AstrologerModel