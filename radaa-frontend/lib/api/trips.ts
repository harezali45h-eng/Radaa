import API from "../apiClient";

export interface Trip {
  _id: string;
  user: string;
  matatu?: {
    plate?: string;
    route?: string;
  } | null;
  status?: string;
  startTime?: string;
  endTime?: string;
  startLocation?: {
    type?: string;
    coordinates?: number[];
  } | null;
  endLocation?: {
    type?: string;
    coordinates?: number[];
  } | null;
  fare?: number;
  currency?: string;
}

export async function getTripHistory(userId: string): Promise<Trip[]> {
  const res = await API.get(`/trips/user/${userId}`);
  const data = res.data as any;
  if (Array.isArray(data)) return data as Trip[];
  if (data && Array.isArray((data as any).data)) return (data as any).data as Trip[];
  return [];
}
