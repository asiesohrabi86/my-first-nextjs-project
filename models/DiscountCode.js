import mongoose from "mongoose";

const DiscountCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "DiscountCode is required"],
      unique: true,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: [true, "DiscountCode is required"],
      min: [1, "Discount percentage must be greater than 0"],
      max: [100, "Discount percentage must be less than 100"],
    },
    expirationDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.DiscountCode ||
  mongoose.model("DiscountCode", DiscountCodeSchema);
