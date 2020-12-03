const mongoose = require('mongoose');


let receiptPeriodSchema = new mongoose.Schema({
    periodnumber: {
        type: Number,
        unique: true
    },
    periodfrom: {
        type: Date
    },
    periodto: {
        type: Date
    },
    savedon: {
        type: Date,
        default: Date.now
    },
    savedbby: {
        type: String
    }
});

mongoose.model('ReceiptPeriod', receiptPeriodSchema);
