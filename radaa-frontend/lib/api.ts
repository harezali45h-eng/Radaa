import api from "./apiClient";

const API = api;

export default API;

export const getLiveMatatus = async () => {
  try {
    const res = await API.get("/matatu-system/live");
    return res.data;
  } catch (error: any) {
    console.error("API ERROR:", (error as any)?.response?.data || error);
    throw error;
  }
};

export const getWallet = async () => {
  try {
    const res = await API.get("/wallet");
    return res.data;
  } catch (error: any) {
    console.error("API ERROR:", (error as any)?.response?.data || error);
    throw error;
  }
};

export const walletDeposit = async (payload: {
  amount: number;
  phoneNumber: string;
}) => {
  try {
    const res = await API.post("/wallet/deposit", payload);
    return res.data;
  } catch (error: any) {
    console.error("API ERROR:", (error as any)?.response?.data || error);
    throw error;
  }
};

export const walletPayFare = async (payload: { amount: number }) => {
  try {
    const res = await API.post("/wallet/pay-fare", payload);
    return res.data;
  } catch (error: any) {
    console.error("API ERROR:", (error as any)?.response?.data || error);
    throw error;
  }
};

export const getMapMarkers = async () => {
  try {
    const res = await API.get("/map/markers");
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
    const res = await API.get("/feature-flags");
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
    const res = await API.get(`/users/${userId}/loyalty`);
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

export const initiateMpesaStkPush = async (payload: {
  userId: string;
  matatuId: string;
  amount: number;
  phoneNumber: string;
  accountReference?: string;
  description?: string;
}) => {
  try {
    const res = await API.post("/mpesa/stk-push", payload);
    return res.data;
  } catch (error: any) {
    console.error("API ERROR:", (error as any)?.response?.data || error);
    throw error;
  }
};

export const getApiHealth = async () => {
  try {
    const res = await API.get("/health");
    return res.data;
  } catch (error: any) {
    console.error("API ERROR:", (error as any)?.response?.data || error);
    throw error;
  }
};
