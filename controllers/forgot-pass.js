const User=require('../models/user');
const forgotPass=require('../models/forgotPass');
const bcrypt=require('bcrypt');
const  uuid=require('uuid');


exports.forgotPassword=async(req,res,next)=>{
    try{
        await   User.findOne({where:{email:req.body.email}})
    .then(user=>{
        if(!user)
        {
            res.json({message:'no user found'});
        }
       else{
        let id=uuid.v4();
        forgotPass.create({id,active:'true',userId:user.id}).then(response=>{
          res.json({message:'user found',link:`http://localhost:3000/success/forgotPass/${response.id}`});
         }).catch(err=>res.json(err));
       }       
    })
    }
    catch(err)
    {
        res.json({err:err,message:'something went wrong'});
    } 
};


exports.PostPassword=async (req,res,next)=>{
  let i=req.params.id;
  try{
await forgotPass.findOne({where:{id:i}}).then(pass=>{
    if(!pass)
    {
      res.send('no request');
    }
    else{
      if(pass.active==='true')
      {
         res.send(`<html>
       <body>
       <h1 class="main-heading">Day To Day Expenses</h1>
       <form class="login" action="/password/success/${i}" method="post">
          <label class="password">New Password:</label>
          <input type="password" id="password" name="password"><br><br>
          <button id="forgot" type="submit">submit</button>
       </form>
       </body>
       </html>`);
      }
      else{
        res.send('<h1>link expired</h1>');
      }
    }
  })
  }
  catch(err)
  {
    res.send(err);
    console.log(err);
  }
  
 
}

exports.success=async (req,res,next)=>{
  console.log(req.body);
    try{
      await forgotPass.findOne({where:{id:req.params.id}}).then(pass=>{
        if(!pass)
        {
          res.json('no request found');
        }
        else{
          if(pass.active==='true')
          {
            let saltRounds=10;
            bcrypt.hash(req.body.password,saltRounds,async(err,hash)=>{
              try{
                await User.findOne({where:{id:pass.userId}}).then(user=>{
                  user.update({password:hash})
                  .then(response=>{
                    pass.update({active:'false'});
                    res.send(`<html lang="en">
                    <body>
                     <h1>password changed successfully!!</h1>
                    </html>`)
                  })
                });
              }
              catch(err)
              {
                res.send(`<html lang="en">
                <body>
                 <h1>something went wrong</h1>
                </html>`)
              }
            })    
          }
          else{
            res.send('<h1>link expired</h1>')
          }
        }
      })
    }
    catch(err)
    {
      res.send(`<html lang="en">
                <body>
                 <h1>something went wrong</h1>
                </html>`)
    }
};
