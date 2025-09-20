import mongoose  from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "product name is required"],
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },
    // روش اول نام دسته بندی را ذخیره میکند
    // category: {
    //     type: String,
    //     required: true
    // },
    // روش دوم برقراری رابطه با جدول دسته بندی است که آیدی دسته بندی را ذخیره میکند
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    views: {type: Number, default: 0},
},
{timestamps: true}
);

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);