const User=require('../models/user');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

exports.postUser=async (req,res,next)=>{
  if(req.body.name==='' && req.body.email=='' && req.body.pass=='')
  {
    throw new Error('all the fields are mendatory');
  }
   try{
    let saltRounds=10;
    bcrypt.hash(req.body.pass,saltRounds,async(err,hash)=>{
      try{
       await User.create({
        name:req.body.name,
        email:req.body.email,
        password:hash,
        ispremiumuser:'false'
         }).then(user=>{
        res.json({success:true,message:"user singned up"});
        console.log('user signed up');
         });  
      }
      catch(err)
      {
        res.status(500).json(err);
        console.log('error in creating user');
      }
    })
   }
  catch(err){
      console.log(err);
    }
};

function generateToken(id)
{
return  jwt.sign({userid:id},process.env.jwt);
}

exports.loginUser=async (req,res,next)=>{
  let email=req.body.email;
  let password=req.body.pass;
  try{
    await User.findOne({where:{email:email}})
    .then(user=>{
      if(!user)
      {
        res.status(404).json({success:false,message:"user doesn't exist"});
        console.log("user doesn't exist");
      }
      else
      {
        console.log(user.password);
        console.log(password);
        bcrypt.compare(password,user.password,(err,response)=>{
          if(response===false)
          {
            res.status(401).json({success:false,message:'wrong password'});
            console.log('not mtched');
            
          }
          if(response===true)
          {
            res.status(200).json({success:true,message:'password matched',token:generateToken(user.id)});
            console.log('matched');
          }
          if(err)
          {
            console.log(err);
            res.status(500).json(err);
          }
        })
      }
      })
  } 
  catch(err){
    console.log(err);
    res.status(500).json(err);
  }
};