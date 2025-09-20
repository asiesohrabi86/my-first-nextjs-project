import mongoose  from "mongoose";

const AddressSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Province",
        required: true
    },
    city: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "City",
        required: true
    },
    address:{
        type: String,
        required: [true, 'address is required'],
        trim: true
    },
    postalCode:{
        type: String,
        unique: true,
        required: [true, 'postalCode is required'],
        trim: true
    },
    number:{
        type: Number,
        required: [true, 'number is required'],
    },
    unit:{
        type: Number,
        required: [true, 'number is required'],
    },
    isRecepient:{
        type: Boolean,
        required: [true, 'isRecepient is required'],
    },
    recepientFirstName:{
        type: String,
        trim: true
    },
    recepientLastName:{
        type: String,
        trim: true
    },
    recepientMobile:{
        type: String,
        trim: true
    },
},
{timestamps: true}
);

export default mongoose.models.Address || mongoose.model('Address', AddressSchema);