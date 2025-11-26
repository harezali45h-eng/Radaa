export const emitPassengerRequest = (app, request = {}) => {
  try {
    if (!app || typeof app.get !== "function") {
      return;
    }

    const io = app.get("io");
    if (!io) {
      return;
    }

    const realtime = io.of("/realtime");
    realtime.emit("ride:created", request || {});
  } catch (error) {
    console.error("[realtime/events/passenger] emitPassengerRequest error", error);
  }
};

export const emitPassengerAccepted = (app, request = {}) => {
  try {
    if (!app || typeof app.get !== "function") {
      return;
    }

    const io = app.get("io");
    if (!io) {
      return;
    }

    const realtime = io.of("/realtime");
    realtime.emit("ride:accepted", request || {});
  } catch (error) {
    console.error("[realtime/events/passenger] emitPassengerAccepted error", error);
  }
};
