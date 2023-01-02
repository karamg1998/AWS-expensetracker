const Sequelize=require('sequelize');
const sequelize=require('../database/db');

const Expense=sequelize.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true,
        unique:true
    },
    amount:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false,
    }   
});

module.exports=Expense;