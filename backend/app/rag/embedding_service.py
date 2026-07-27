from fastembed import TextEmbedding


class EmbeddingService:

    def __init__(self):
        self.model = None


    def get_model(self):
        if self.model is None:
            self.model = TextEmbedding(
                model_name="BAAI/bge-small-en-v1.5"
            )

        return self.model


    async def embed(self, text: str):
        model = self.get_model()

        embeddings = list(
            model.embed([text])
        )

        return embeddings[0].tolist()


    async def embed_many(self, texts: list[str]):
        model = self.get_model()

        embeddings = model.embed(texts)

        return [
            embedding.tolist()
            for embedding in embeddings
        ]


embedding_service = EmbeddingService()