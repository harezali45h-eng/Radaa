import { getQueueMetrics, listPendingRequests } from "../services/requestQueueService.js";

export const getQueueOverview = async (req, res, next) => {
  try {
    const limit = Number(req.query.limit || 50);
    const [metrics, pending] = await Promise.all([
      getQueueMetrics(),
      listPendingRequests({ limit }),
    ]);

    return res.json({
      success: true,
      data: {
        metrics,
        pending,
      },
    });
  } catch (error) {
    return next(error);
  }
};
