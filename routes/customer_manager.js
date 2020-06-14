const express = require('express');
const router = express.Router();
const constants = require('../utils/constants');
const routers = require('../utils/routers');
var payloadChecker = require('payload-validator');
const jwt = require("jsonwebtoken");
const Loans = require('../models/loan_modal');
const Customers = require('../models/customer_manager_modal');
const key = require("../config/Keys");
const passport = require('passport');
const Routers = require('../utils/routers');


var expectedPayLoad = {
    "MobileNumberKey": "",
    "PasswordKey": "",
    "FullNameKey": "",
    "LoanTypeKey": 0,
    "LoanStatusKey":0,
    "LoanIdKey" : ""
};

//Customer Login
router.post(routers.LOGIN, (req, res) => {
    var paylodResult = payloadChecker.validator(req.body, expectedPayLoad, ["MobileNumberKey", "PasswordKey"], false);
    if (paylodResult.success) {
        var phone_number = req.body.MobileNumberKey;
        var password = req.body.PasswordKey;
        Customers.findOne({ MobileNumber: phone_number, password: password }).then(user => {
            if (user) {
                const jwt_payload = { id: user.id, mobile: user.MOBILE_NUMBER };
                jwt.sign(jwt_payload, key.secretOrKey, (err, token) => {
                    res.status(201).json({
                        Login_Result: {
                            message: "Success",
                            status: true,
                            token: token
                        }
                    });
                });
            } else {
                res.status(406).json({
                    Login_Result: {
                        message: "Not Registered",
                        status: false
                    }
                });
            }
        });

    } else {
        res.status(400).json({
            error: paylodResult.response.errorMessage,
            status: false
        });
    }
});

router.get(routers.VIEW_LOAN_REQUEST, passport.authenticate("jwt", { session: false }), (req, res) =>{
    if(req.user){
         Loans.find( { CustomerManagerId : req.user.id } ).then(loanRequest => {
           res.status(200).json(loanRequest);
         });
         }else{  
           res.status(400).json({status : 1});
         }
});

router.put(Routers.LOAN_STATUS_UPDATE,passport.authenticate("jwt",{session:false}),(req,res)=>{
    var paylodResult = payloadChecker.validator(req.body, expectedPayLoad, ["LoanIdKey", "LoanStatusKey"], false);
    if(paylodResult.success){
        var loanId = req.body.LoanIdKey;
        var loanStatus = req.body.LoanStatusKey;
        Loans.updateOne({_id:loanId,CustomerManagerId:req.user.id},{$set:{"LoanStatus":loanStatus}}).then(loanStatus=>{
         res.json({
             "message":"Status Updated",
         })
        });
    }else{
        res.status(400).json({
            error: paylodResult.response.errorMessage,
            status: false
        });
    }
});


module.exports = router;