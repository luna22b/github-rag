import httpx


class OllamaClient:
    def __init__(self):
        self.base_url = "http://ollama:11434"

    async def chat(self, messages: list[dict]):
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{self.base_url}/api/chat",
                json={
                    "model": "llama3.1:8b",
                    "messages": messages,
                    "stream": False,
                },
            )

            response.raise_for_status()

            data = response.json()

            return data["message"]["content"]


ollama_client = OllamaClient()
