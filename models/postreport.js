const mongoose = require('mongoose');

let postSchema = new mongoose.Schema({
    patientId:String,
    visitDate:Date,
    providerName:String,
    facility:String
});
mongoose.model('PostRoundUp', postSchema);
