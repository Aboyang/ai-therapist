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
        model="gpt-4o-mini",
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

html_summary = """
- Age: 21
- Gender: Female
- Main Concern: Relationship, Depression

Any Relevant Conversation Stages (Story Lines)
- Stage 1: Patient expresses grief over the loss of a long term relationship.
- Stage 2: Patient shares the impact of the stress that it creates on her especially having to juggle her academics at the same time.
- Stage 3: Patient finds that she has attached her self-worth and identity to the relationship, losing which, has caused her to feel as if a part of her is taken.

- Action Points
 - Seek emotional support, such as talking to a close friend, family member, or counselor.
 - Separate self-worth from relationship outcomes, focusing on personal strengths and achievements.
 - Practice stress management strategies: journaling, mindfulness, or short study breaks.
 - Attend study groups or consult a tutor to reduce academic anxiety.
 - Does the patient feel better towards the end?

Yes — the patient is open to taking steps to improve their situation.
"""
link = upload_to_supabase(html_summary)