const mongoose = require('mongoose');

let employeeSchema = new mongoose.Schema({
    fname: String,
    image: String
});

mongoose.model('EmployeeModel', employeeSchema);
