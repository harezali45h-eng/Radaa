import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  handle: { type: String, unique: true, sparse: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  loyalty: {
    paidRidesCount: { type: Number, default: 0 },
    freeRides: { type: Number, default: 0 }
  },
  name: { type: String },
  balance: { type: Number, default: 0 },
  ridesTaken: { type: Number, default: 0 },
  ridesPaid: { type: Number, default: 0 },
  loyaltyPoints: { type: Number, default: 0 },
  role: {
    type: String,
    enum: ["user", "driver", "admin"],
    default: "user"
  },
  enabled: {
    type: Boolean,
    default: true
  },
  driverProfile: {
    saccoName: { type: String },
    vehicleRegistration: { type: String },
    licenseNumber: { type: String },
    profilePhotoUrl: { type: String }
  },
  saccoProfile: {
    saccoName: { type: String },
    registrationNumber: { type: String },
    logoUrl: { type: String },
    permitUrl: { type: String },
    insuranceUrl: { type: String },
    complianceDocUrl: { type: String }
  },
  driverVerificationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  }
});

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(this.password, salt);
  this.password = hashed;
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
