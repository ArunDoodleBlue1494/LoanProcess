const mongoose = require('mongoose');
const constants = require('../utils/constants');
const Schema = mongoose.Schema;


const UserSchema = new Schema({
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
   EMail:{
       type : String,
       unique : true  
   },
   DateOfBirth:{
    type : String,
    },
    Gender : {
        type : String
    },
    MonthlyIncome:{
        type : Number,
    },
    Loans:[
        {
            LoanID:{
                type: Schema.Types.ObjectId,
                ref : constants.LOANS
            },
        }
    ]
});

module.exports = Users = mongoose.model(constants.USERS,UserSchema);  