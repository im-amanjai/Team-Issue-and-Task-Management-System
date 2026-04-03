import axiosInstance from "./axiosInstance";

export const getMyNotifications = async () => {
  const response = await axiosInstance.get("/api/notifications/my");
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await axiosInstance.patch(`/api/notifications/${id}/read`);
  return response.data;
};
