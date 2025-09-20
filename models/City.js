import mongoose  from "mongoose";

const CitySchema = new mongoose.Schema({
    province: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Province",
        required: true
    },
    name:{
        type: String,
        required: [true, 'city name is required'],
        trim: true
    }
},
{timestamps: true}
);

export default mongoose.models.City || mongoose.model('City', CitySchema);