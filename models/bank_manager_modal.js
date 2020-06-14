const mongoose = require('mongoose');
const constants = require('../utils/constants');
const Schema = mongoose.Schema;


const BankManagerSchema = new Schema({
    MobileNumber:{
        type : String,
        unique : true,
        required:true
   },
   FullName:{
       type : String,
       required:true
   },
   Password:{
        type : String,
        required:true
   },
});

module.exports = Managers = mongoose.model(constants.BANK_MANAGER,BankManagerSchema);  