const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const keys = require('../config/keys');
const Customers = require('../models/customer_manager_modal');
const Managers = require('../models/bank_manager_modal');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;
  
        
    module.exports = customerPassport =>{
    
        customerPassport.use(new JwtStrategy(opts, (jwt_payload,done) =>{
            Customers.findById(jwt_payload.id).then(
                customer_manager => {
                    if(customer_manager){
                        return done(null,customer_manager);
                    }
                return done(null,false);
            })
            .catch(err=>console.log(err));
            console.log(jwt_payload)
    
        }));
    };