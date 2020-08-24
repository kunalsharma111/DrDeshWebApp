const mongoose = require('mongoose');

let uploadFiles = new mongoose.Schema({
  fiName: String,
  status: String,
  savedon: Date,
  savedby: String
})

let employeeSchema = new mongoose.Schema({

    fname: String,
    savedon: Date,
    savedby : String,
    files: [uploadFiles]
});

mongoose.model('EmployeeDetail', employeeSchema);
