from app.database.models import CodeChunk


def delete_file_chunks(
    db,
    file_id: int,
):
    db.query(CodeChunk).filter(CodeChunk.repository_file_id == file_id).delete()
