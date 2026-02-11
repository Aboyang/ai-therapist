from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from app.services.stream import stream_openai
from app.services.rag import search_embeddings

router = APIRouter(
    prefix="/chat",
    tags=["chat"]
)

# Pydantic model for the request body
class ChatRequest(BaseModel):
    prompt: str

@router.post("/stream")
async def streaming_response(request: ChatRequest):

    prompt = request.prompt
    results = search_embeddings(prompt)

    context = f"""
        You are a helpful assistant. Use the following pieces of context to answer the question.
        If you don't know the answer, just say that you don't know, don't try to make up an answer.

        When making a factual statement, cite it using [chunk_id].
        If you don't know, say you don't know.

        User Prompt: {prompt}

        Context:
    """
    for r in results:
        context += f"{r.payload['content']} [{r.payload['chunk_id']}]\n"

    print(">>> Context for response:")
    print(context)

    async def event_generator():
        async for chunk in stream_openai(context):
            yield chunk

    # StreamingResponse sends chunks as they arrive
    return StreamingResponse(event_generator(), media_type="text/plain")
