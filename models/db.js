const mongoose = require('mongoose');
// old db
// const uri = "mongodb+srv://sukrit:love@cluster0-bn91a.mongodb.net/test?retryWrites=true&w=majority";
// production DB
// const uri = "mongodb+srv://bwb_app_user:Balanced@123@balancedwellbeing.fqn52.mongodb.net/BalancedWellbeing?retryWrites=true&w=majority";
// deveolpment DB
const uri = "mongodb+srv://bwb_app_user:Balanced@123@balancedwellbeing.fqn52.mongodb.net/DevelopmentBalancedWellbeing?retryWrites=true&w=majority";
require('./users.model');
require('./patient.model');
require('./r2patient.model');
require('./facility.model');
require('./insurance.model');
require('./med.model');
require('./provider.model');
require('./masterptrecord.model');
require('./postreport')
mongoose.connect(uri,{useNewUrlParser:true,useUnifiedTopology: true,useFindAndModify:false }, (err)=>{
    if(err) {
        console.log(err);
    }
    else{
        console.log('db connected');
    }
});
mongoose.Promise = global.Promise;