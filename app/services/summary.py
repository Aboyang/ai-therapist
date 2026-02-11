from openai import OpenAI
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import uuid
from datetime import datetime
from typing import List
from services.rag import store_embeddings

# Load environment
load_dotenv()

# --- OpenAI ---
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# --- Supabase ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
SUPABASE_BUCKET = os.getenv("SUPABASE_BUCKET")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)


def generate_summary_html(age: int, gender: str, concerns: List[str], conversation_context: str) -> str:
    """
    Sends conversation to OpenAI and returns summary.
    """

    prompt = f"""
    You are a clinical documentation assistant.

    From the following conversation, extract and summarise in this EXACT format:

    - Age
    - Gender
    - Main Concern

    - Any Relevant Conversation Stages (Story Lines)
    - Stage 1:
    - Stage 2:
    - Stage 3:
    - etc

    - Action Points

    - Does the patient feel better towards the end? (Yes/No + short explanation)

    CONTEXT BELOW
    Gender: 
    {gender}
    Age:
    {age}
    Concerns: {".".join(concerns)}
    Conversation:
    {conversation_context}
    """

    response = client.chat.completions.create(
        model="gpt-4.1",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1
    )

    return response.choices[0].message.content


def upload_to_supabase(html_content: str) -> str:
    """
    Uploads HTML file to Supabase Storage and returns public URL.
    """

    # Unique filename
    filename = f"summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}_{uuid.uuid4().hex}.html"

    # Upload
    supabase.storage.from_(SUPABASE_BUCKET).upload(
        path=filename,
        file=html_content.encode("utf-8"),
        file_options={"content-type": "text/html"}
    )

    # Get public URL
    public_url = supabase.storage.from_(SUPABASE_BUCKET).get_public_url(filename)

    # Uploading to Qdrant
    store_embeddings(filename, html_content)

    return public_url


def create_patient_summary(age: int, gender: str, concerns: List[str], conversation_context: str) -> str:
    """
    Full pipeline:
    1. Generate HTML
    2. Upload to Supabase
    3. Return link and html summary
    """

    html_summary = generate_summary_html(age, gender, concerns, conversation_context)
    link = upload_to_supabase(html_summary)

    return link, html_summary
