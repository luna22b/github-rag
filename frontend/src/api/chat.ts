import axios from "axios";
import { API_URL } from "#/config";

export async function createChat(repositoryId: number) {
  const response = await axios.post(
    `${API_URL}/api/chat/repositories/${repositoryId}/chats`,
    {},
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function getChats(repositoryId: number) {
  const response = await axios.get(
    `${API_URL}/api/chat/repositories/${repositoryId}/chats`,
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function getChat(chatId: number) {
  const response = await axios.get(`${API_URL}/api/chat/chats/${chatId}`, {
    withCredentials: true,
  });

  return response.data;
}

export async function sendMessage(sessionId: number, question: string) {
  const response = await axios.post(
    `${API_URL}/api/chat/sessions/${sessionId}/messages`,
    {
      question,
    },
    {
      withCredentials: true,
    },
  );

  return response.data;
}

export async function deleteChat(chatId: number) {
  const response = await axios.delete(`${API_URL}/api/chat/chats/${chatId}`, {
    withCredentials: true,
  });

  return response.data;
}
