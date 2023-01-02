const userController=require('../controllers/user');
const express=require('express');
const router=express.Router();

router.post('/user/signup',userController.postUser);
router.post('/user/login',userController.loginUser);

module.exports=router;