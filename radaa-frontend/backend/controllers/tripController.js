import {
  startTripService,
  stopTripService,
  getTripHistoryService
} from "../services/tripService.js";

export const startTrip = async (req, res, next) => {
  try {
    const trip = await startTripService(req.body);
    res.status(201).json(trip);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const stopTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const trip = await stopTripService({ id, ...req.body });
    res.json(trip);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const getTripHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const trips = await getTripHistoryService(userId);
    res.json(trips);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};
