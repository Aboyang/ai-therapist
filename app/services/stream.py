from openai import OpenAI
import os
from dotenv import load_dotenv
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

async def stream_openai(prompt: str):
    stream = client.responses.create(
        model="gpt-4.1",
        input=[{"role": "user", "content": prompt}],
        stream=True
    )

    for event in stream:
        if event.type == "response.output_text.delta":
            yield event.delta
