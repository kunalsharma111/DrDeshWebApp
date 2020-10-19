const mongoose = require('mongoose');

let uploadFiles = new mongoose.Schema({
    fiName: String,
    status: String,
    documentname: String,
    savedon: Date,
    savedby: String,
    remark: String
  })

  let empFacility = new mongoose.Schema({
    facilityName: String,
    subscribeStatus: Boolean,
    facilityStartDate: Date,
    facilityEndDate: Date,
    facilityCharges: Number,
    savedon: Date,
    savedby: String,
    remark: String,
    submitbutton: Boolean
  })

  let empVacation = new mongoose.Schema({
    vacationFrom: Date,
    vacationTo: Date,
    vacacationType: String,
    vacationReason: String,
    vacationStatus: String,
    savedon: Date,
    savedby: String
  })

let userSchema = new mongoose.Schema({
    fname: {
        type: String
    },
    lname: {
        type: String
    },
    empId: {
        type: Number,
    },
    dob: {
        type: Date
    },
    email: {
        type: String,
        unique: true
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
    },
    facilities:{
        type:[empFacility]
    },
    Vacations:{
        type:[empVacation]
    }
});

mongoose.model('User', userSchema);
