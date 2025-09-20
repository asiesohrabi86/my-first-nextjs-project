import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('اطلاعات اتصال به دیتابیس یافت نشد');
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = {conn: null, promise: null};
}

async function connectToDatabase(params) {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
            return mongoose;
        });
    }

    cached.conn = cached.promise;
    return cached.conn;
}

export default connectToDatabase;