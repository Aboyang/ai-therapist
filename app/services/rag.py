from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
import uuid
import nltk
nltk.download('punkt_tab', download_dir="./venv/nltk_data")
from nltk.tokenize import sent_tokenize

from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

qdrant = QdrantClient(
    url="https://ccb322f0-1690-41ac-ab9e-b194176f0ec2.eu-west-2-0.aws.cloud.qdrant.io",
    api_key=QDRANT_API_KEY
)

COLLECTION_NAME = "ai-therapist"

if not qdrant.collection_exists(collection_name=COLLECTION_NAME):
    qdrant.create_collection(
        collection_name=COLLECTION_NAME,
        vectors_config=VectorParams(
            size=1536,
            distance=Distance.COSINE
        )
    )

openai = OpenAI(api_key=OPENAI_API_KEY)

def tokenize_into_sentences(text):
    if not text:
        return []
    return sent_tokenize(text)

def create_embeddings(chunks):
    # Create embeddings
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=chunks
    )

    embs = [item.embedding for item in response.data]
    return embs


def store_embeddings(document, content):
    # Create embeddings
    chunks = tokenize_into_sentences(content)
    embs = create_embeddings(chunks)

    # Upsert into Qdrant
    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=[
            {
                "id": uuid.uuid4(),
                "vector": emb,
                "payload": {
                    "content": c,
                    # payloads for citation and source tracking
                    "source": document,
                    "chunk_id": f"{document}/chunk{i}",
                }
            }
            for i, (emb, c) in enumerate(zip(embs, chunks))
        ]
    )

def search_embeddings(query):
    response = openai.embeddings.create(
        model="text-embedding-3-small",
        input=[query]
    )
    query_vector = response.data[0].embedding

    results = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=6
    ).points

    return results