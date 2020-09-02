const mongoose = require('mongoose');

let uploadFiles = new mongoose.Schema({
    fiName: String,
    status: String,
    documentname: String,
    savedon: Date,
    savedby: String,
    remark: String
  })

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
    },
    files:{
        type: [uploadFiles]
    }
});

mongoose.model('User', userSchema);
