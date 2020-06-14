const express = require('express');
const router = express.Router();
const constants = require('../utils/constants');
const routers = require('../utils/routers');
const Users = require('../models/user_modal');
const Loans = require('../models/loan_modal');
const Customers = require('../models/customer_manager_modal');
var payloadChecker = require('payload-validator');
const passport = require('passport');
const jwt = require("jsonwebtoken");
const key = require("../config/Keys");


var expectedPayLoad = {
    "MobileNumberKey": "",
    "PasswordKey": "",
    "FullNameKey": "",
    "LoanAmountKey": 0,
    "LoanTypeKey": 0
};


router.get('/', (req, res) => res.json(
    {
        Message: {
            status: 200,
            message: constants.USERS,
            id: 1,
            isValid: true
        }
    }
));

///SignUp
router.post(routers.SIGNUP, (req, res) => {
    var paylodResult = payloadChecker.validator(req.body, expectedPayLoad, ["MobileNumberKey", "PasswordKey", "FullNameKey"], false);
    if (paylodResult.success) {
        var phone_number = req.body.MobileNumberKey;
        var password = req.body.PasswordKey;
        var name = req.body.FullNameKey;
        Users.findOne({ MobileNumber: phone_number }).then(user => {
            if (user) {
                res.status(406).json({
                    Signup_Result: {
                        message: "Already Registered",
                        status: false
                    }
                });
            } else {
                const newUsers = new Users({
                    MobileNumber: phone_number,
                    Password: password,
                    FullName: name
                });
                newUsers.save().then(user => {
                    res.status(201).json({
                        Signup_Result: {
                            message: "Registered",
                            status: true,
                        }
                    });
                })

            }
        });
    } else {
        res.status(400).json({
            error: paylodResult.response.errorMessage,
            status: false
        });
    }
});

//Login
router.post(routers.LOGIN, (req, res) => {
    var paylodResult = payloadChecker.validator(req.body, expectedPayLoad, ["MobileNumberKey", "PasswordKey"], false);
    if (paylodResult.success) {
        var phone_number = req.body.MobileNumberKey;
        var password = req.body.PasswordKey;
        Users.findOne({ MobileNumber: phone_number, Password: password }).then(user => {
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



router.post(routers.APPLY_LOAN, passport.authenticate("jwt", { session: false }), (req, res) => {

    var paylodResult = payloadChecker.validator(req.body, expectedPayLoad, ["LoanAmountKey", "LoanTypeKey"], false);

    if (paylodResult.success) {
        var UserId = req.user.id;
        var LoanAmount = req.body.LoanAmountKey;
        var LoanTypeKey = req.body.LoanTypeKey;
        var customerId;
        var loanDocumentlength;
        var asignId;
        var customermanagerDocumentLength = 4;
        Loans.countDocuments().then(loan => {
            if (loan == 0) {
                loanDocumentlength = 1;
            } else {
                loanDocumentlength = loan + 1;
            }

            var temp = loanDocumentlength % customermanagerDocumentLength;

            if (temp === 0) {
                asignId = customermanagerDocumentLength - 1;
            } else {
                asignId = temp - 1;
            }

            Customers.find({}).then(user => {
                customerId = user[asignId]._id;

                const NewLoan = new Loans({
                    UserId: UserId,
                    CustomerManagerId: customerId,
                    LoanAmount: LoanAmount,
                    LoanType: LoanTypeKey
                });

                NewLoan.save().then(loan => {
                    res.status(201).json({
                        message: "Loan Application Submitted",
                        status: true,
                        Loan: loan
                    });
                });

            });

        });
    } else {
        res.status(400).json({
            error: paylodResult.response.errorMessage,
            status: false
        });
    }

});


router.get(routers.MY_LOANS, passport.authenticate("jwt", { session: false }), (req, res) =>{

    if(req.user){
         Loans.find( { UserId : req.user.id } ).then(myLoans => {
           res.status(200).json(myLoans);
         });
         }else{  
           res.status(400).json({status : 1});
         }

});

router.get('/view_loan', passport.authenticate("jwt", { session: false }), (req, res) =>{

    if(req.user){
         Loans.findOne( { _id:req.query.LoanIdKey,UserId : req.user.id } ).then(myLoans => {
           res.status(200).json(myLoans);
         });
         }else{  
           res.status(400).json({status : 1});
         }

});



module.exports = router;