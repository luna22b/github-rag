import axios from "axios";
import { API_URL } from "#/config";

export async function getCurrentUser() {
  try {
    const response = await axios.get(`${API_URL}/api/auth/me`, {
      withCredentials: true,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function logoutUser() {
  await axios.post(
    `${API_URL}/api/auth/logout`,
    {},
    {
      withCredentials: true,
    },
  );
}
