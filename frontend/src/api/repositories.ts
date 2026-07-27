import axios from "axios";
import { API_URL } from "#/config";

export async function getRepositories() {
  const response = await axios.get(`${API_URL}/api/repositories/repos`, {
    withCredentials: true,
  });

  return response.data;
}

export async function syncRepositories() {
  const response = await axios.post(
    `${API_URL}/api/repositories/sync/repos`,
    {},
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function importRepository(repositoryId: number) {
  await axios.post(
    `${API_URL}/api/repositories/repos/${repositoryId}/import`,
    {},
    {
      withCredentials: true,
    },
  );
}
