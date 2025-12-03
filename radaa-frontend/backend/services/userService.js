import User from "../models/User.js";
import { generateToken } from "../utils/helpers.js";
import { ValidationError, AuthError } from "../utils/errors.js";
import { isFeatureEnabled } from "../utils/featureFlags.js";
import { FEATURE_FLAG_KEYS } from "../config/featureFlags.js";

export const getUsersService = async () => {
  const users = await User.find({}).select("-password");
  return users;
};

export const createUserService = async ({ username, email, phone, password, handle }) => {
  if (!username || !email || !password) {
    throw new ValidationError("Please provide username, email, and password");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ValidationError("User already exists");
  }

  if (handle) {
    const existingHandleUser = await User.findOne({ handle });

    if (existingHandleUser) {
      throw new ValidationError("Handle already taken");
    }
  }

  const user = await User.create({ username, email, phone, password, handle });

  return {
    _id: user._id,
    username: user.username,
    handle: user.handle,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    role: user.role
  };
};

export const registerUserService = async ({
  username,
  email,
  phone,
  password,
  handle,
  role,
  saccoName,
  registrationNumber,
  vehicleRegistration,
  licenseNumber,
  profilePhoto
}) => {
  if (!username || !email || password == null) {
    throw new ValidationError("Please provide username, email, and password");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ValidationError("User already exists");
  }

  if (handle) {
    const existingHandleUser = await User.findOne({ handle });

    if (existingHandleUser) {
      throw new ValidationError("Handle already taken");
    }
  }

  let finalRole = "user";

  const requestedRole = typeof role === "string" ? role : undefined;

  const allowDriverSignup = await isFeatureEnabled(
    FEATURE_FLAG_KEYS.DRIVER_SIGNUP_V1
  );
  const allowSaccoSignup = await isFeatureEnabled(FEATURE_FLAG_KEYS.SACCO_ADMIN_V1);

  if (requestedRole === "driver" && allowDriverSignup) {
    finalRole = "driver";
  } else if (requestedRole === "admin" && allowSaccoSignup) {
    finalRole = "admin";
  }

  if (finalRole === "driver") {
    if (!phone || !saccoName || !vehicleRegistration) {
      throw new ValidationError(
        "Driver signup requires phone, saccoName, and vehicleRegistration when role=driver"
      );
    }
  }

  const createPayload = {
    username,
    email,
    phone,
    password,
    handle,
    role: finalRole
  };

  if (finalRole === "driver") {
    createPayload.driverProfile = {
      saccoName: saccoName || undefined,
      vehicleRegistration: vehicleRegistration || undefined,
      licenseNumber: licenseNumber || undefined,
      profilePhotoUrl: profilePhoto || undefined
    };
    createPayload.driverVerificationStatus = "pending";
  } else if (finalRole === "admin") {
    if (!saccoName) {
      throw new ValidationError("SACCO signup requires saccoName when role=admin");
    }

    createPayload.saccoProfile = {
      saccoName,
      registrationNumber: registrationNumber || undefined,
      logoUrl: undefined,
      permitUrl: undefined,
      insuranceUrl: undefined,
      complianceDocUrl: undefined
    };
  }

  const user = await User.create(createPayload);

  return {
    _id: user._id,
    username: user.username,
    handle: user.handle,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    role: user.role,
    token: generateToken(user._id)
  };
};

export const loginUserService = async ({ email, password }) => {
  if (!email || !password) {
    throw new ValidationError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AuthError("Invalid email or password", 401);
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new AuthError("Invalid email or password", 401);
  }

  return {
    _id: user._id,
    username: user.username,
    handle: user.handle,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    role: user.role,
    token: generateToken(user._id)
  };
};

export const getProfileService = async (user) => {
  if (!user) {
    throw new AuthError("Not authorized", 401);
  }

  return user;
};

export const getLoyaltyStatusService = async (userId) => {
  if (!userId) {
    throw new ValidationError("userId is required");
  }

  const user = await User.findById(userId).select(
    "loyalty loyaltyPoints ridesTaken ridesPaid balance"
  );

  if (!user) {
    throw new ValidationError("User not found");
  }

  return {
    userId: user._id,
    balance: user.balance,
    ridesTaken: user.ridesTaken,
    ridesPaid: user.ridesPaid,
    loyaltyPoints: user.loyaltyPoints,
    loyalty: user.loyalty || { paidRidesCount: 0, freeRides: 0 }
  };
};
