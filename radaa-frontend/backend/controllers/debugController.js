import mongoose from "mongoose";

export const getDbDebugInfo = async (req, res, next) => {
  try {
    const connection = mongoose.connection;

    const stateMap = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting"
    };

    const stateCode = connection.readyState;
    const state = stateMap[stateCode] ?? "unknown";

    const host = (connection.host || connection?.client?.s?.options?.hosts?.[0]?.host) ?? null;
    const port = (connection.port || connection?.client?.s?.options?.hosts?.[0]?.port) ?? null;
    const name = connection.name ?? connection.db?.databaseName ?? null;

    res.json({
      status: "ok",
      db: {
        stateCode,
        state,
        host,
        port,
        name
      }
    });
  } catch (error) {
    if (error.statusCode) {
      res.status(error.statusCode);
    }
    next(error);
  }
};
