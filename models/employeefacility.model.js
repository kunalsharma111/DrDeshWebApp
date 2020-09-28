const mongoose = require('mongoose');


let employeeFacilitySchema = new mongoose.Schema({
    facilityname: {
        type: String,
        unique: true
    },
    status: {
        type: Boolean
    },
    savedon: {
        type: Date,
        default: Date.now
    },
    subscribeStatus: {
        type: Boolean,
        default: false
    },
    savedbby: {
        type: String
    }
});

mongoose.model('EmployeeFacility', employeeFacilitySchema);
