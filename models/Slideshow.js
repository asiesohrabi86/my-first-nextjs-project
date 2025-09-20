import mongoose from "mongoose";

const SlideshowSchema = new mongoose.Schema({
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

export default mongoose.models.Slideshow || mongoose.model('Slideshow', SlideshowSchema);