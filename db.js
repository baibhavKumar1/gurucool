const mongoose = require('mongoose');
require('dotenv').config()
const connect = mongoose.connect(process.env.DATABASE_URI);

module.exports = connect 