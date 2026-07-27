from app.rag.embedding_service import embedding_service


async def create_embeddings(chunks: list[str]):
    embeddings = await embedding_service.embed_many(chunks)

    return embeddings