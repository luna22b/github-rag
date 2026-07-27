from google import genai

from app.core.config import settings


class LLMService:

    def __init__(self):
        self.client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )


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

        response = self.client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
        )

        result = response.text.strip().upper()

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


        response = self.client.models.generate_content(
            model="gemini-flash-latest",
            contents=prompt,
        )

        return response.text



llm_service = LLMService()