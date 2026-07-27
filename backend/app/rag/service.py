from app.rag.chunker import chunk_text
from app.rag.embeddings import create_embeddings
from app.database.models import CodeChunk
from app.rag.delete_chunks import delete_file_chunks


async def index_file(
    db,
    repository,
    file,
):

    delete_file_chunks(
        db,
        file.id,
    )

    chunks = chunk_text(file.content)

    embeddings = create_embeddings(chunks)

    for index, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
        code_chunk = CodeChunk(
            repository_id=repository.id,
            repository_file_id=file.id,
            content=chunk,
            embedding=embedding,
            chunk_index=index,
        )

        db.add(code_chunk)

    db.commit()
