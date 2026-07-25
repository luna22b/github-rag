async def index_repository(
    db,
    repository,
    files,
):
    print(
        f"Indexing {len(files)} files for {repository.name}"
    )

    for file in files:
        print(
            f"Indexing file: {file.path}"
        )

    return {
        "indexed": len(files)
    }