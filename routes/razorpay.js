const express=require('express');
const razorRoutes=require('../controllers/pay');

const router=express.Router();


router.get('/checkout',razorRoutes.getOrderId);
router.post('/success',razorRoutes.postPayment);

module.exports=router;