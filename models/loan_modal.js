const mongoose = require('mongoose');
const constants = require('../utils/constants');
const Schema = mongoose.Schema;

const LoanSchema = new Schema({

    UserId:{
        type : Schema.Types.ObjectId,
        ref : constants.USERS
    },
    CustomerManagerId:{
        type : Schema.Types.ObjectId,
        ref : constants.CUSTOMER_MANAGER
    },
    LoanAmount:{
        type:Number,
        required:true
    },
    LoanType:{
        type : Number,
        required:true
    },
    LoanStatus:{
        type : Number,
        default : 0
    },
    CreatedAt : {
        type : Date,
        default : Date.now
    },
});

module.exports = Loans = mongoose.model(constants.LOANS,LoanSchema);