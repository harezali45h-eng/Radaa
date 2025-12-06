import {
  initiateMpesaStkPushService,
  handleMpesaCallbackService
} from "../services/mpesaService.js";

export const initiateMpesaStkPush = async (req, res, next) => {
  try {
    const result = await initiateMpesaStkPushService(req.body);
    res.status(201).json(result);
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const mpesaStkCallback = async (req, res, next) => {
  try {
    const result = await handleMpesaCallbackService(req.body);
    res.status(200).json({
      ResultCode: 0,
      ResultDesc: "Accepted",
      data: result
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};
