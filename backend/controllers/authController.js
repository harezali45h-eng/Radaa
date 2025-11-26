import {
  registerUserService,
  loginUserService,
  getProfileService
} from "../services/userService.js";

export const registerUser = async (req, res, next) => {
  try {
    const result = await registerUserService(req.body);
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const result = await loginUserService(req.body);
    res.json({
      success: true,
      message: "Login successful",
      data: result
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const result = await getProfileService(req.user);
    res.json({
      success: true,
      message: "Profile retrieved successfully",
      data: result
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};
