import {
  registerMatatuService,
  getLiveMatatusService,
  getMatatuDetailsService,
  updateMatatuLocationService
} from "../services/matatuService.js";

export const registerMatatu = async (req, res, next) => {
  try {
    const matatu = await registerMatatuService(req.body);
    res.status(201).json(matatu);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const getLiveMatatus = async (req, res, next) => {
  try {
    const matatus = await getLiveMatatusService();
    res.json(matatus);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const getMatatuDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const matatu = await getMatatuDetailsService(id);
    res.json(matatu);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const updateMatatuLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;
    const io = req.app.get("io");

    const result = await updateMatatuLocationService({ id, lat, lng, io });

    res.json(result);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};
