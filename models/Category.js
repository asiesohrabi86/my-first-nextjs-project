import mongoose  from "mongoose";

const CategorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'category name is required'],
        trim: true
    }
},
{timestamps: true}
);

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);