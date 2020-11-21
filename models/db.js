const mongoose = require('mongoose');
const logger = require("../logger/logger");
import { environment } from '../src/environments/environment';
// old db
// const uri = "mongodb+srv://sukrit:love@cluster0-bn91a.mongodb.net/test?retryWrites=true&w=majority";

// production DB
const uri = "mongodb+srv://bwb_app_user:Balanced@123@balancedwellbeing.fqn52.mongodb.net/BalancedWellbeing?retryWrites=true&w=majority";
// deveolpment DB
// const uri = "mongodb+srv://bwb_app_user:Balanced@123@balancedwellbeing.fqn52.mongodb.net/DevelopmentBalancedWellbeing?retryWrites=true&w=majority";
require('./users.model');
require('./employee.model');
require('./patient.model');
require('./r2patient.model');
require('./facility.model');
require('./insurance.model');
require('./med.model');
require('./provider.model');
require('./masterptrecord.model');
require('./postreport');
require('./testing.model');
require('./testing.model');
require('./employeefacility.model');
mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify:false }, (err)=>{
    if(err) {
        console.log(err);
        logger.error(err);
    }
    else{
        logger.info("DB connected:")
        console.log('db connected', uri);
    }
});
mongoose.Promise = global.Promise;
