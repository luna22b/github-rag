from langchain_text_splitters import RecursiveCharacterTextSplitter


def chunk_text(file_content: str):

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        separators=["\nclass ", "\ndef ", "\n\n", "\n", " ", ""],
    )

    chunks = splitter.split_text(file_content)

    return chunks
