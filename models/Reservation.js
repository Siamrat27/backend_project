const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    apptDate:{
        type:Date,
        required:true
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    coworkingspace:{
        type:mongoose.Schema.ObjectId,
        ref:'Coworkingspace',
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('Reservation',ReservationSchema);

