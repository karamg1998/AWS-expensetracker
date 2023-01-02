const razorpay=require('razorpay');
const Order=require('../models/order');
const User=require('../models/user');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');
dotenv.config();

const instance=new razorpay({
    key_id:process.env.razorKey,
    key_secret:process.env.razorSecretkey
});

exports.getOrderId=async (req,res,next)=>{
    var options={
                 amount:6000*100,
                 currency:'INR'
                };
    instance.orders.create(options,async (err,order)=>{
        let token=req.header('authorization');
        let Token=jwt.verify(token,process.env.jwt);
        if(token===undefined)
        {
            res.json('your are not logged in')
        }
        else{ 
             let order_d=order;
            try{
                await Order.create({
                orderid:order_d.id,
                status:'pending',
                userId:Token.userid
            })
            .then(item=>{
                res.json({order:order,keyId:instance.key_id});
                console.log('order added')
                });
            }
        catch(err)
        {
            res.json(err);
            console.log('error');
        }
        } 
    })
};

exports.postPayment=async (req,res,next) => {
    console.log(req.body);
    let T=jwt.verify(req.body.token,process.env.jwt);
    let userID=T.userid;
    try {
        let order_id=req.body.orderId;
        let payment_id=req.body.paymentId;
       await Order.findOne({where : {orderid : order_id}}).then(order => {
            order.update({ paymentid: payment_id, status: 'SUCCESSFUL'}).then(() => {
                User.findOne({where:{id:userID}}).then(user=>{
                    user.update({ispremiumuser:'true'}).then(()=>console.log('user updated'));
                })
                return res.status(202).json({sucess: true, message: "Transaction Successful"});
            }).catch((err)=> {
                throw new Error(err);
            })
        }).catch(err => {
            throw new Error(err);
        })
    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Something went wrong' })
    }
};