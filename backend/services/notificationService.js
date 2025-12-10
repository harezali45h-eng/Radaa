import { ValidationError } from "../utils/errors.js";

const toIdString = (value) => {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value.toString === "function") return value.toString();
  return null;
};

const getNamespace = (io) => {
  if (!io || typeof io.of !== "function") return null;
  return io.of("/realtime");
};

export const sendSocketNotification = (io, room, event, payload) => {
  const nsp = getNamespace(io);
  if (!nsp || !event) return;

  if (room) {
    nsp.to(room).emit(event, payload);
  } else {
    nsp.emit(event, payload);
  }
};

export const notifyUser = (io, userId, event, payload) => {
  const id = toIdString(userId);
  if (!id) return;
  const room = `user:${id}`;
  sendSocketNotification(io, room, event, payload);
};

export const notifyPassenger = (io, passengerId, event, payload) => {
  const id = toIdString(passengerId);
  if (!id) return;
  const room = `passenger:${id}`;
  sendSocketNotification(io, room, event, payload);
};

export const notifyDriver = (io, driverId, event, payload) => {
  const id = toIdString(driverId);
  if (!id) return;
  const room = `driver:${id}`;
  sendSocketNotification(io, room, event, payload);
};

export const assertNotificationPayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    throw new ValidationError("notification payload must be an object");
  }
};
