IGNORED_DIRECTORIES = {
    ".git",
    "node_modules",
    "dist",
    "build",
    ".next",
    ".venv",
    "__pycache__",
    ".idea",
    ".vscode",
}

IGNORED_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".svg",
    ".ico",
    ".pdf",
    ".zip",
    ".exe",
}

def should_ignore_file(path: str):
    parts = path.split("/")

    if any(directory in IGNORED_DIRECTORIES for directory in parts):
        return True

    for extension in IGNORED_EXTENSIONS:
        if path.endswith(extension):
            return True

    return False