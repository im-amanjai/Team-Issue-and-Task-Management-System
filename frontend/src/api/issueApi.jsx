import axios from "axios";

const API_URL = "http://localhost:5000/api/issues";

export const getMyIssues = (token) =>
  axios.get(`${API_URL}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const getIssueById = (id, token) =>
  axios.get(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const updateIssueStatus = (id, status, token) =>
  axios.patch(
    `${API_URL}/${id}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const addComment = (id, message, token) =>
  axios.post(
    `${API_URL}/${id}/comments`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
