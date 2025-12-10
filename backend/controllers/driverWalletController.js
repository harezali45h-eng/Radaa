import { getDriverWalletWithHistory, requestDriverWithdrawal } from "../services/driverWalletService.js";

export const getDriverWallet = async (req, res, next) => {
  try {
    const driverId = req.user?._id;

    const wallet = await getDriverWalletWithHistory(driverId);

    res.json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};

export const postDriverWithdrawal = async (req, res, next) => {
  try {
    const driverId = req.user?._id;
    const { amount, phoneNumber } = req.body || {};

    const { wallet, withdrawal } = await requestDriverWithdrawal({
      driverId,
      amountRequested: amount,
      phoneNumber,
    });

    res.status(201).json({
      success: true,
      data: {
        wallet,
        withdrawal,
      },
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};
