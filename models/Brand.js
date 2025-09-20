import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema({
    imageUrl:{
        type: String,
        required: true,
        trim: true,
    },
    name:{
        type: String,
        required: true,
        trim: true,
    },
},
{timestamps: true});

export default mongoose.models.Brand || mongoose.model('Brand', BrandSchema);