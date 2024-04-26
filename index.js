const express = require('express');
const app = express();
const cors = require('cors');
const connect = require('./db');
const UserRouter = require('./Route/user.route');
const AstroRouter = require('./Route/astrologer.route');
app.use(express.json());
app.use(cors());

app.use('/user',UserRouter);
app.use('/astro',AstroRouter)
app.get('/', async (req, res) => {
    res.status(200).send('Hi')
})
  
app.listen(3000, async () => {
    try {
        await connect
        console.log("connected");
    } catch (err) {
        console.log(err.message);
    }
    console.log("running");
}) 