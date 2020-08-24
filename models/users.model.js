const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    empId: {
        type: Number
    },
    dob: {
        type: Date
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    pwd: {
        type: String
    },
    userrole: {
        type: String
    },
    otp:{
        type: String
    }
});

mongoose.model('User', userSchema);
