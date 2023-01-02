const expenseController=require('../controllers/expense');
const express=require('express');
const router=express.Router();

router.post('/addexpense',expenseController.postExpense);
router.get('/getexpense',expenseController.getExpense);
router.get('/user/leaderboard',expenseController.leaderName);
router.get('/leaderBoard/expenses',expenseController.Lexpense);
router.get('/expense/user',expenseController.downloadFile);
router.delete('/deleteexpense/:id',expenseController.delExpense);

module.exports=router;