const express=require('express');
const sequelize=require('./database/db');
const bodyparser=require('body-parser');
//const helmet=require('helmet');
const compression=require('compression');
//const morgan=require('morgan');
const path=require('path');
const dotenv=require('dotenv');
dotenv.config();

const userRoutes=require('./routes/userRoutes');
const expenseRoutes=require('./routes/expenseRoutes');
const payRoutes=require('./routes/razorpay');
const forgotRoutes=require('./routes/forgot-pass');

const expense=require('./models/expense-table');
const user=require('./models/user');
const order=require('./models/order');
const forgot=require('./models/forgotPass');
const cors=require('cors');
const app=express();

//app.use(morgan('combined'));
app.use(compression());
//app.use(helmet());
app.use(cors());
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());
app.use(userRoutes);
app.use(expenseRoutes);
app.use(payRoutes);
app.use(forgotRoutes);

app.use((req,res)=>{
    console.log(req.url);
   res.sendFile(path.join(__dirname,`frontend/${req.url}`))
});

user.hasMany(expense);
user.hasMany(order);
user.hasMany(forgot)


sequelize
.sync()
.then(app.listen(4000));