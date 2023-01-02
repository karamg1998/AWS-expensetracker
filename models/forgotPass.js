const Sequelize=require('sequelize');
const sequelize=require('../database/db');

const ForgotPass=sequelize.define('Forgotpass-table',{
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    active: Sequelize.STRING,
    
});

module.exports=ForgotPass;