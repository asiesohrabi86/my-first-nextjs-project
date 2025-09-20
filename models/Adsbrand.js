import mongoose from "mongoose";

const AdsbrandSchema = new mongoose.Schema({
    imageUrl:{
        type: String,
        required: true,
        trim: true,
    },
    url:{
        type: String,
        required: true,
        trim: true,
    },
},
{timestamps: true});

export default mongoose.models.Adsbrand || mongoose.model('Adsbrand', AdsbrandSchema);