from sentence_transformers import SentenceTransformer


model = None


def get_model():
    global model

    if model is None:
        model = SentenceTransformer("all-MiniLM-L6-v2")

    return model


def create_embeddings(chunks: list[str]):
    model = get_model()

    embeddings = model.encode(chunks)

    return embeddings.tolist()