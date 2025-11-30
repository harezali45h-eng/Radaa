import api from "./apiClient";

const API = api;

export default API;

export const getLiveMatatus = async () => {
  try {
    const res = await API.get("/api/matatus/live");
    return res.data;
  } catch (error: any) {
    console.error("API ERROR:", (error as any)?.response?.data || error);
    throw error;
  }
};

export const getMapMarkers = async () => {
  try {
    const res = await API.get("/api/map/markers");
    const data = res.data;

    if (data && typeof data === "object" && "data" in (data as any)) {
      return (data as any).data;
    }

    return data;
  } catch (error: any) {
    console.error("API ERROR:", (error as any)?.response?.data || error);
    throw error;
  }
};

export const getFeatureFlags = async () => {
  try {
    const res = await API.get("/api/feature-flags");
    const data = res.data;

    if (data && typeof data === "object" && "data" in (data as any)) {
      return (data as any).data;
    }

    return data;
  } catch (error: any) {
    console.error("API ERROR:", (error as any)?.response?.data || error);
    throw error;
  }
};

export const getLoyaltyStatus = async (userId: string) => {
  try {
    const res = await API.get(`/api/users/${userId}/loyalty`);
    return res.data;
  } catch (error: any) {
    console.error("API ERROR:", (error as any)?.response?.data || error);
    throw error;
  }
};

export const initiatePayment = async (payload: {
  userId: string;
  amount: number;
  method: string;
}) => {
  try {
    const res = await API.post("/payments/initiate", payload);
    return res.data;
  } catch (error: any) {
    console.error("API ERROR:", (error as any)?.response?.data || error);
    throw error;
  }
};

export const verifyPayment = async (payload: {
  userId: string;
  matatuId?: string;
  amount: number;
  method: string;
  transactionId: string;
}) => {
  try {
    const res = await API.post("/payments/verify", payload);
    return res.data;
  } catch (error: any) {
    console.error("API ERROR:", (error as any)?.response?.data || error);
    throw error;
  }
};

export const getApiHealth = async () => {
  try {
    const res = await API.get("/api/health");
    return res.data;
  } catch (error: any) {
    console.error("API ERROR:", (error as any)?.response?.data || error);
    throw error;
  }
};

