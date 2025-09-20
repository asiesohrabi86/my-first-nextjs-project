import mongoose  from "mongoose";

const GallerySchema = new mongoose.Schema({
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
},
{timestamps: true}
);

export default mongoose.models.Gallery || mongoose.model('Gallery', GallerySchema);