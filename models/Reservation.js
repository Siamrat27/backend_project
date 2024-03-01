const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
    reservationDate:{
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
    timereservation:{
        required:[true,'Please add timereservation'],
        type:String
    },
    createAt:{
        type:Date,
        default:Date.now
    }
});

module.exports=mongoose.model('Reservation',ReservationSchema);

