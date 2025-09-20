import mongoose  from "mongoose";

const CommentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    comment:{
        type: String,
        required: true,
        trim: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    isConfirmed:{
        type: Boolean,
        default: false
    },
},
{timestamps: true}
);

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);