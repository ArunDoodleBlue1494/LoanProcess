const express = require('express');
const router = express.Router();
const constants = require('../utils/constants');
const routers = require('../utils/routers');
var payloadChecker = require('payload-validator');
const jwt = require("jsonwebtoken");
const Loans = require('../models/loan_modal');
const BankManager = require('../models/bank_manager_modal');
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
router.post(routers.BANK_MANAGER_LOGIN, (req, res) => {
    var paylodResult = payloadChecker.validator(req.body, expectedPayLoad, ["MobileNumberKey", "PasswordKey"], false);
    if (paylodResult.success) {
        var phone_number = req.body.MobileNumberKey;
        var password = req.body.PasswordKey;
        BankManager.findOne({ MobileNumber: phone_number, password: password }).then(user => {
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

router.get("/customer_manager_approved_loans", passport.authenticate("jwt", { session: false }), (req, res) =>{
    if(req.user){
         Loans.find({LoanStatus: 1}).then(loanRequest => {
           res.status(200).json(loanRequest);
         });
         }else{  
           res.status(400).json({status : 1});
         }
});

router.get(routers.VIEW_ALL_LOANS, passport.authenticate("jwt", { session: false }), (req, res) =>{
    if(req.user){
         Loans.find({}).then(loanRequest => {
           res.status(200).json(loanRequest);
         });
         }else{  
           res.status(400).json({status : 1});
         }
});

router.get('/view_approved_loans', passport.authenticate("jwt", { session: false }), (req, res) =>{
    if(req.user){
         Loans.find({LoanStatus: 2}).then(loanRequest => {
           res.status(200).json(loanRequest);
         });
         }else{  
           res.status(400).json({status : 1});
         }
});

router.get('/view_rejected_loans', passport.authenticate("jwt", { session: false }), (req, res) =>{
    if(req.user){
         Loans.find({LoanStatus: 3}).then(loanRequest => {
           res.status(200).json(loanRequest);
         });
         }else{  
           res.status(400).json({status : 1});
         }
});

router.put(routers.LOAN_APPROVED_REJECTED,passport.authenticate("jwt",{session:false}),(req,res)=>{
    var paylodResult = payloadChecker.validator(req.body, expectedPayLoad, ["LoanIdKey", "LoanStatusKey"], false);
    if(paylodResult.success){
        var loanId = req.body.LoanIdKey;
        var loanStatus = req.body.LoanStatusKey;
        Loans.updateOne({_id:loanId,LoanStatus:1},{$set:{"LoanStatus":loanStatus}}).then(loanStatus=>{
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