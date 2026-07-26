def get_file_changes(
    github_files,
    existing_files,
):
    existing_map = {file.path: file for file in existing_files}

    github_paths = set()

    new_files = []
    updated_files = []
    unchanged_files = []

    for file in github_files:
        github_paths.add(file["path"])

        existing = existing_map.get(file["path"])

        if existing is None:
            new_files.append(file)

        elif existing.sha != file["sha"]:
            updated_files.append(file)

        else:
            unchanged_files.append(file)

    deleted_files = [file for file in existing_files if file.path not in github_paths]

    return {
        "new": new_files,
        "updated": updated_files,
        "unchanged": unchanged_files,
        "deleted": deleted_files,
    }
