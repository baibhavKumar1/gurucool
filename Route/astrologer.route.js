const AstrologerModel = require("../Model/astrologer.model");
const AstroRouter = require('express').Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Model/user.model');
const SessionModel = require('../Model/session.model');
const {CronJob} = require('cron');

const secretKey = process.env.JWT_SECRET_KEY;
const saltRounds = 10;

const job = new CronJob(
	'0 0 * * *',
	async function () {
		try {
            const astrologers = await AstrologerModel.find();
            for (const astro of astrologers) {
                await AstrologerModel.findByIdAndUpdate(astro._id, { remaining: astro.flow },{new:true});
            }
        } catch (error) {
            console.error('Error updating field:', error);
        }
	},
	null,
	true,
	'Asia/Kolkata'
);

AstroRouter.post('/register', async(req,res)=>{
    const {name,email,password}= req.body;
    try{
        const exist= await AstrologerModel.findOne({email});
        if(exist){
            return res.status(400).send("User already exist");
        }
        bcrypt.hash(password,saltRounds,async(err,hash)=>{
            if(err){
                return res.status(400).send(err.message);
            }
            const user= new AstrologerModel({
                name,email,password:hash
            });
            await user.save();
            const token = jwt.sign({userID:user._id,userEmail:email,userPass:password}, secretKey);
            res.status(200).json({message:"User Registered",token,name:user.name});
        })
    }catch(err){
        return res.status(400).send(err.message)
    }
})

AstroRouter.post("/login",async(req,res)=>{
    const {email,password} =req.body;
    try{
        const user =await AstrologerModel.findOne({email});
        if (user){
            bcrypt.compare(password,user.password,(err, decoded) => {
                if(decoded){
                    const token = jwt.sign({userID:user._id,userEmail:email,userPass:password},"token");
                    res.status(200).json({message:"User Logged In",token,name:user.name});
                }else{
                    res.status(400).json(err.message);
                }
            });
        }else{
            res.status(400).send("User does not exist");
        }
    }catch(err){
        res.status(400).send("User is not found");
    }
});
AstroRouter.patch("/edit/:id",async(req,res)=>{
  const {id} = req.params;
    try{
        const user =await AstrologerModel.findByIdAndUpdate(id,{...req.body},{new:true});
        res.status(200).json({user})
    }catch(err){
        res.status(400).send("User is not found");
    }
});

AstroRouter.post('/endSession', async (req, res) => {
    const { sessionId } = req.body;
    if (sessionId) {
      try {
        const session = await SessionModel.findByIdAndUpdate(sessionId, { endedAt: Date.now() }, { new: true });
        let astro = await AstrologerModel.findById(req.body.userID);
        if (astro.activeSessions.length > 1) {
          astro.activeSessions.shift();
          await AstrologerModel.findByIdAndUpdate(req.body.userID, { activeSessions: astro.activeSessions , remaining:(astro.remaining - 1) },{new:true});
        } else {
          astro = await AstrologerModel.findByIdAndUpdate(req.body.userID, { isBooked: false, remaining:(astro.remaining - 1) }, { new: true });
        }
        res.status(200).json({ message: 'Session ended successfully' });
      } catch (err) {
        console.error(err);
        res.status(400).json({ error: err.message });
      }
    }
  });
  

AstroRouter.post('/flow',async(req,res)=>{
  try{
    const astro= req.body.userID;
    await AstrologerModel.findByIdAndUpdate(astro,{flow:req.body.flow},{new:true})
  }catch(err){
    console.log(err.message);
  }
})



module.exports = {AstroRouter,job}