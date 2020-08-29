const mongoose = require('mongoose');


let employeeSchema = new mongoose.Schema({

    documentname: String,
    uploadbttonflag: Boolean,
    savedon: Date,
    savedby : String,
    documentstatus: String,
    documenttype: String,
    filename: String,
    showonui: Boolean,
    documentlink: String,
    defaultform: String
});

mongoose.model('documentrequiredfromEmployee', employeeSchema);
