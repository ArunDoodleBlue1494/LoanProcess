const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user_modal');
const keys = require('../config/keys');
const Customers = require('../models/customer_manager_modal');
const Managers = require('../models/bank_manager_modal');
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport =>{
  
    passport.use(new JwtStrategy(opts, (jwt_payload,done) =>{

        User.findById(jwt_payload.id)
        .then(user=>{
            if(user){
                return done(null,user);
            }else{
                Customers.findById(jwt_payload.id).then(
                customer_manager => {
                    if(customer_manager){
                        return done(null,customer_manager);
                    }else{
                        Managers.findById(jwt_payload.id).then(
                            manager =>{
                                if(manager){
                                    return done(null,manager);
                                }
                            }
                        );
                    }
                }
                );
            }
            //return done(null,false);
        })
        .catch(err=>console.log(err));

    }));
};