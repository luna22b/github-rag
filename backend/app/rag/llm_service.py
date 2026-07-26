import httpx


class LLMService:

    def __init__(self):
        self.base_url = "http://ollama:11434"


    async def is_repository_question(
        self,
        question: str,
    ) -> bool:

        prompt = f"""
Determine if this user message is asking about a software repository.

Return ONLY:
YES
or
NO

Examples:

"hello"
NO

"how does authentication work?"
YES

"what database does this use?"
YES

"thanks"
NO

User message:

{question}
"""


        async with httpx.AsyncClient(timeout=60) as client:

            response = await client.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": "llama3.1:8b",
                    "prompt": prompt,
                    "stream": False,
                },
            )

            response.raise_for_status()

            result = response.json()["response"].strip().upper()


            return result.startswith("YES")



    async def generate(
        self,
        question: str,
        chunks,
    ):

        if chunks:

            context = "\n\n".join(
                [
                    f"""
File: {chunk.repository_file.path}

Code:
{chunk.content}
"""
                    for chunk in chunks
                ]
            )


            prompt = f"""
You are an AI assistant for a GitHub repository.

Answer using ONLY the repository context.

Rules:
- Never invent files or functionality.
- Mention filenames when explaining.
- Explain code flow when useful.
- If the answer is missing, say you cannot find it.

Repository Context:

{context}


User Question:

{question}
"""


        else:

            prompt = f"""
You are a helpful AI assistant.

The user is having a normal conversation.

Respond naturally.

User:

{question}
"""


        async with httpx.AsyncClient(timeout=120) as client:

            response = await client.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": "llama3.1:8b",
                    "prompt": prompt,
                    "stream": False,
                },
            )


            response.raise_for_status()

            return response.json()["response"]



llm_service = LLMService()