import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

export const getMyNotifications = (token) =>
  axios.get(`${API_URL}/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const markNotificationRead = (id, token) =>
  axios.patch(
    `${API_URL}/${id}/read`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );