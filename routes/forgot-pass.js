const express=require('express');
const passController=require('../controllers/forgot-pass');
const router=express.Router();

router.post('/forgotpassword',passController.forgotPassword);
router.use('/success/forgotPass/:id',passController.PostPassword);
router.post('/password/success/:id',passController.success);

module.exports=router;