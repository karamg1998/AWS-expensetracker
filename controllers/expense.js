const Expense=require('../models/expense-table');
const User=require('../models/user');
const jwt=require('jsonwebtoken');
const path=require('path');
const otc=require('objects-to-csv');
const dotenv=require('dotenv');
dotenv.config();


exports.postExpense=async (req,res,next)=>{
  let id=jwt.verify(req.body.id,process.env.jwt);
  let userid=id.userid;
 try{
  await Expense.create({
    amount:req.body.amount,
    description:req.body.description,
    category:req.body.category,
    userId:userid
  }).then(expense=>{
    res.json({success:true,message:'expense added',amount:expense.amount,
    description:expense.description,category:expense.category});
    console.log('expense created');
  })
 }
 catch(err)
 {
  res.status(500).json({err:err,message:'error in creating expense'});
  console.log('error in creating expense');
 }
};

function encryptId(id)
{
  return jwt.sign({userid:id},process.env.jwt);
}

exports.getExpense=async (req,res,next)=>{
 let page=req.query.page;
 let token=req.header('Authorization');
 let itemsPerPage=parseFloat(req.header('ipp'));
 let totalProds;
 if(token===undefined)
 {
    console.log('null');
 }
 else{
  let id=jwt.verify(token,process.env.jwt);
  let userid=id.userid;
  try{
    await Expense.count({where:{userId:userid}}).then(count=>{
      totalProds=count;
      return Expense.findAll({offset:(page-1)*itemsPerPage,limit:itemsPerPage,where:{userId:userid}});
    }).then(expense=>{
      let obj=[];
    for(var i=0;i<expense.length;i++)
    {
      let id=expense[i].id;
       obj.push({id:encryptId(id),amount:expense[i].amount,
                 description:expense[i].description,
                 category:expense[i].category});
    }
    User.findOne({where:{id:userid}})
    .then((user)=>{
      res.json({
        name:user.name,
        premium:user.ispremiumuser,
        data:obj,
        currentpage:page,
        hasNextPage:itemsPerPage*page<totalProds,
        previousPage:page>1,
        lastPage:Math.ceil(totalProds/itemsPerPage),
        totalProds:totalProds
      });
       console.log('expense sent');
    })  
    })
  }
  catch(err){
    res.status(500).json({err:err,message:'error in getting all expense'})
    console.log('error in getting expense');
  }
 }
}; 

exports.delExpense=async (req,res,next)=>{
    let Id=req.params.id;
    let v=jwt.verify(Id,process.env.jwt);
    try{
      await Expense.findByPk(v.userid)
      .then(expense=>{
        expense.destroy();
        res.json({success:true,message:'expense deleted'});
        console.log('expense deleted');
      });
    }
    catch(err){
          console.log('error in deleting expense');
          res.status(500).json({success:false,message:'error in deleting expense'});
    }
};

exports.leaderName=async (req,res,next)=>{
  let t=req.header('leader');
  if(t===undefined)
  {
    console.log('null');
  }
  else{
    let I=jwt.verify(t,process.env.jwt);
    try{
      await User.findOne({where:{id:I.userid}})
      .then(user=>
      {
        let name=user.name;
        let obj=[];
        let exp=[];
        if(user.ispremiumuser==='false')
         {
        let n=[{obj:'Not a premium user'}]
         res.json(n);
        }
        else{
           User.findAll().then(user=>{
        for(var i=0;i<user.length;i++)
        {
          obj.push({name:user[i].name,id:encryptId(user[i].id)}); 
        }
        Expense.findAll().then(expense=>{
          for(var i=0;i<expense.length;i++)
          {
            exp.push({amount:expense[i].amount,userId:encryptId(expense[i].userId)});
          }
          res.json({pUser:name,obj:obj,exp:exp})
        })
       })
      }
      })
    }
    catch(err)
    {
      console.log(err);
      res.json(err);
    }
  }

};

exports.Lexpense=async(req,res,next)=>{
  let name=req.header('name');
  try{
  await  User.findOne({where:{name:name}})
    .then(user=>{
      if(user.ispremiumuser==='true')
      {
        res.json({message:'cant see expenses of other premium user'});
      }
      else{
         Expense.findAll({where:{userId:user.id}}).then(expense=>{
         let obj=[];
         for(var i=0;i<expense.length;i++)
         {
          obj.push({amount:expense[i].amount,description:expense[i].description,
                    category:expense[i].category});
         }
         res.json({message:'not a premium user',obj:obj});
      })
      }
    })
  }
  catch(err){
    res.json(err)
  }
};

exports.downloadFile=async(req,res,next)=>{
  let token=req.header('auth');
  let t=jwt.verify(token,process.env.jwt);
  let id=t.userid
 try{
await User.findOne({where:{id:id}}).then(user=>{
    if(!user)
    {
      res.json({message:'no user found'});
    }
    else{
      if(user.ispremiumuser==='false')
      {
         res.json({user:'false',message:'not a premium user'})
      }  
      else{
        Expense.findAll({where:{userId:id}}).then(expense=>{
          let obj=[];
          for(var i=0;i<expense.length;i++)
          {
            obj.push({amount:expense[i].amount,description:expense[i].description,category:expense[i].category});
          }
          const csv = new otc(obj);
          csv.toDisk('./expense.csv');
          res.status(200).sendFile(path.join(__dirname,'../expense.csv'));
        })
      }
   }
  })
 }
 catch(err)
 {
  res.json({err:err});
 }
};