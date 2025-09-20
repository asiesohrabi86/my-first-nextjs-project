import mongoose  from "mongoose";

const ProvinceSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'province name is required'],
        trim: true
    }
},
{timestamps: true}
);

export default mongoose.models.Province || mongoose.model('Province', ProvinceSchema);