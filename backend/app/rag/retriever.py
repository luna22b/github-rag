from sqlalchemy.orm import Session, selectinload
from sqlalchemy import select

from app.database.models import CodeChunk
from app.rag.embedding_service import embedding_service


async def retrieve_similar_chunks(
    db: Session,
    repository_id: int,
    query: str,
    limit: int = 5,
):
    query_embedding = await embedding_service.embed(query)

    distance = CodeChunk.embedding.cosine_distance(query_embedding)

    statement = (
        select(CodeChunk)
        .options(
            selectinload(CodeChunk.repository_file)
        )
        .where(
            CodeChunk.repository_id == repository_id
        )
        .order_by(distance)
        .limit(limit)
    )

    results = db.execute(statement).scalars().all()

    return results