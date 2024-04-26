const AstrologerModel = require("../Model/astrologer.model");
const AstroRouter = require('express').Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Model/user.model');
const SessionModel = require('../Model/session.model');

const secretKey = process.env.JWT_SECRET_KEY;
const saltRounds = 10;

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

AstroRouter.post('/endSession', async(req,res)=>{
  const {sessionId} = req.body;
  if(sessionId){
    try{
        const session = await SessionModel.findByIdAndUpdate(sessionId,{endedAt:Date.now},{new:true});
        const astro = await AstrologerModel.findById(req.body.userID);
        if(astro.activeSessions.length>1){

        }else{
            astro = await AstrologerModel.findByIdAndUpdate(req.body.userID,{isBooked:false},{new:true})
        }
         
    }catch(err){

    }
  }
})

AstroRouter.post('/flow',async(req,res)=>{

})



module.exports = AstroRouter