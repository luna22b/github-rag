import axios from "axios";

export async function getCurrentUser() {
  try {
    const response = await axios.get("http://localhost:8000/api/auth/me", {
      withCredentials: true,
    });

    return response.data;
  } catch {
    return null;
  }
}

export async function logoutUser() {
  await axios.post(
    "http://localhost:8000/api/auth/logout",
    {},
    {
      withCredentials: true,
    },
  );
}
