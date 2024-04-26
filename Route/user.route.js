const UserRouter = require('express').Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require('../Model/user.model');
const AstrologerModel = require('../Model/astrologer.model');
const SessionModel = require('../Model/session.model');

const secretKey = process.env.JWT_SECRET_KEY;
const saltRounds = 10;

const getAstro = async()=>{
   const astro = await AstrologerModel.find({isBooked:false}).sort({ "activeSessions.length": 1, rating: -1 });
   if(astro.length === 0){
    return "No one is free"
   }else{
    console.log(astro)
   }
}

UserRouter.get('/',async(req,res)=>{
   const data = await getAstro()
    res.status(200).json({data})
})

UserRouter.post('/register', async(req,res)=>{
    const {name,email,password}= req.body;
    
    try{
        const exist= await UserModel.findOne({email});
        if(exist){
            return res.status(400).send("User already exist");
        }
        bcrypt.hash(password,saltRounds,async(err,hash)=>{
            if(err){
                return res.status(400).send(err.message);
            }
            const user= new UserModel({
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

UserRouter.post("/login",async(req,res)=>{
    const {email,password} =req.body;
    try{
        const user =await UserModel.findOne({email});
        if (user){
            bcrypt.compare(pass,user.password,(err, decoded) => {
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

UserRouter.post('/startSession',async(req,res)=>{
    try{
        const user = await UserModel.findById(req.body.userID);
        
        const session = new SessionModel(
            {astrologer:astro[0],user:user._id,query:req.body.query}
        )
        res.status(200).json({session})
    }catch(err){
        res.status(400).json({error:err.message})
    }
})
module.exports = UserRouter