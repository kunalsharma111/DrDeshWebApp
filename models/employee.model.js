const mongoose = require('mongoose');

let employeeSchema = new mongoose.Schema({
    documentname: String,
    uploadbttonflag: Boolean,
    documentstatus: String,
    filename: String,
    documenttype: String,
    documentlink: String,
    templateform: String,
    showonui: Boolean
});

mongoose.model('DocumentRequiredFromEmployee', employeeSchema);
// showonui : {$ne: false}
// savedon: Date,
    // savedby : String,
