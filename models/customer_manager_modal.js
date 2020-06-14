const mongoose = require('mongoose');
const constants = require('../utils/constants');
const Schema = mongoose.Schema;


const CustomerManagerSchema = new Schema({
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

module.exports = Customers = mongoose.model(constants.CUSTOMER_MANAGER,CustomerManagerSchema);  