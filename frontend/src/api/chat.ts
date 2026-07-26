import axios from "axios";

export async function askRepository(repositoryId: number, question: string) {
  try {
    const response = await axios.post("http://localhost:8000/chat/", {
      repository_id: repositoryId,
      question,
    });

    return response.data;
  } catch (error: any) {
    console.log("STATUS:", error.response?.status);
    console.log("DATA:", error.response?.data);

    throw error;
  }
}
