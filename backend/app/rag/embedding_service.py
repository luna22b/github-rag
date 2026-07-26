from sentence_transformers import SentenceTransformer


class EmbeddingService:
    def __init__(self):
        self.model = SentenceTransformer("all-MiniLM-L6-v2")

    async def embed(self, text: str):
        embedding = self.model.encode([text])

        return embedding[0].tolist()


embedding_service = EmbeddingService()
