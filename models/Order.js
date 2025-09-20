import mongoose  from "mongoose";

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
                min: 1,
            }
        }
    ],
    discountPrice:{
        type: Number,
        default: 0
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    finalPrice: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['در انتظار', 'در حال پردازش', 'تکمیل شده', 'لغو شده'],
    },
    address: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
        required: true
    }
},
{timestamps: true}
);

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);