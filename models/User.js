import mongoose  from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'name is required'],
        trim: true
    },
    phone:{
        type: String,
        required: [true, 'phone is required'],
        trim: true,
        unique: true
    },
    email:{
        type: String,
        trim: true
    },
    isActive:{
        type: Boolean,
        default: false,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
},
{timestamps: true}
);

export default mongoose.models.User || mongoose.model('User', UserSchema);