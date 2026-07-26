import axios from "axios";

const API_URL = "http://localhost:8000/chat";

export async function createChat(repositoryId: number) {
  const response = await axios.post(
    `${API_URL}/repositories/${repositoryId}/chats`,
  );

  return response.data;
}

export async function getChats(repositoryId: number) {
  const response = await axios.get(
    `${API_URL}/repositories/${repositoryId}/chats`,
  );

  return response.data;
}

export async function getChat(chatId: number) {
  const response = await axios.get(`${API_URL}/chats/${chatId}`);

  return response.data;
}

export async function sendMessage(sessionId: number, question: string) {
  const response = await axios.post(
    `${API_URL}/sessions/${sessionId}/messages`,
    {
      question,
    },
  );

  return response.data;
}

export async function deleteChat(chatId: number) {
  const response = await axios.delete(`${API_URL}/chats/${chatId}`);

  return response.data;
}
