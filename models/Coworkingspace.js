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
    tel:{
        type: String
    },
    opentime:{
        type: String
    },
    closetime:{
        type: String
    }
});

module.exports=mongoose.model('Coworkingspace',CoworkingspaceSchema);