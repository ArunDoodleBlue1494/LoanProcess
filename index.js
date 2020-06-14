const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();

//Local DataBase Connection
mongoose.connect('mongodb://localhost:27017/LoanProcess',{ useNewUrlParser : true, useCreateIndex: true,useUnifiedTopology: true  })
    .then(result =>{
        if(result.connection){
            console.log("MongoDB Connected");
        }else{
            console.log("MongoDB Connection Error")
        }
    });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true }));
app.use(passport.initialize());
require('./config/passport')(passport);

//Routes
app.use('/users',require('./routes/users'));
app.use('/customer_manager',require('./routes/customer_manager'));
app.use('/bank_manager',require('./routes/bank_manager'));



const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log('Server Started on Port' ,PORT));