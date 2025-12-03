import {
  getUsersService,
  createUserService,
  getLoyaltyStatusService
} from "../services/userService.js";

export const getUsers = async (req, res, next) => {
  try {
    const users = await getUsersService();
    res.json(users);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const getLoyaltyStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await getLoyaltyStatusService(id);
    res.json(result);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const result = await createUserService(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};
