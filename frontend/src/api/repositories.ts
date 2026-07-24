import axios from "axios";

export async function getRepositories() {
  const response = await axios.get(
    "http://localhost:8000/api/repositories/repos",
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function syncRepositories() {
  const response = await axios.post(
    "http://localhost:8000/api/repositories/sync/repos",
    {},
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function importRepository(repositoryId: number) {
  await axios.post(
    `http://localhost:8000/api/repositories/${repositoryId}/import`,
    {},
    {
      withCredentials: true,
    },
  );
}
