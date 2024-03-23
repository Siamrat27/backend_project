const mongoose = require(`mongoose`);

const CoworkingspaceSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Please add a name'],
        unique: true,
        trim:true,
        maxlength: [50,'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        required: [true,'Please add an address']
    },
    district:{
        type: String,
        required: [true,'Please add a district']
    },
    province:{
        type: String,
        required: [true,'Please add a province']
    },
    postalcode:{
        type: String,
        required: [true,'Please add a postalcode'],
        maxlength:[5,'Postal Code can not be more than 5 digits']
    },
    telephone_number:{
        type: String
    },
    opentime:{
        type: String,
        required:[true,'Please add an opentime'],
        maxlength:[5,'Time can not be more than 5 digits']
    },
    closetime:{
        type: String,
        required:[true,'Please add an closetime'],
        maxlength:[5,'Time can not be more than 5 digits']
    },
    picture:{
        type: String,
        required:[true,'Please add a picture'],
    },
    star:{
        type: Number,
        required: [true,'Please add a rating'],
        min: [0, 'Rating must be at least 0'],
        max: [5, 'Rating can not be more than 5']
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

//Cascode delete reservations when a coworkingspace in deleted
CoworkingspaceSchema.pre('deleteOne',{document:true,query:false},async function(next){
    console.log(`Reservations being removed from coworkingspace ${this._id}`);
    await this.model('Reservation').deleteMany({coworkingspace:this._id});
    next();
});

//Reverse populate with virtuals
CoworkingspaceSchema.virtual('reservations',{
    ref:'Reservation',
    localField:'_id',
    foreignField:'coworkingspace',
    justone:false
});

module.exports=mongoose.model('Coworkingspace',CoworkingspaceSchema);