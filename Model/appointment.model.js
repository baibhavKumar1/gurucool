const {Schema,model} = require('mongoose');

const appointmentSchema = new Schema(
    {
        astrologer:String,
        user:String,
        scheduledAt:{
            type:Date,
            default:Date.now
        },
        completedAt:Date,
        query:String,
    },{versionKey:false}
)

const AppointmentModel = model("appointment",appointmentSchema)

module.exports = AppointmentModel