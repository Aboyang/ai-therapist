# Serene

**The AI-Mediated Bridge to Mental Health Care**

Serene is a **real-time conversational AI agent** designed to dismantle the "Initiation Barrier" for socially avoidant individuals. It acts as a judgment-free on-ramp that transitions users from isolation to professional therapy.

---

## The Barrier

### The Challenge

For individuals with Avoidant Personality Disorder (AvPD) or severe social anxiety, the first therapy session feels like a high-stakes social performance. This "Psychological Cliff" creates a critical gap: patients seek help but are paralyzed by the fear of being judged by a human stranger.

### The Gap

Standard solutions fail this demographic:

- **Traditional Therapy:** Requires immediate, high-stakes vulnerability with a stranger.  
- **Standard Chatbots:** Lack clinical depth and fail to bridge the user to actual professional care.

### The Vision

Serene is the **Missing Middle Ground** — a low-stakes buffer designed for **Therapeutic Readiness**, not a replacement for human empathy.

---

## Core Features

### For Patients

- **Judgment-Free Clinical Dialogue:** Provides a safe, non-human interface for initial disclosure through a voice AI agent.  
- **Guided Diagnostic Inquiry:** Adaptive AI surfaces triggers, patterns, and coping gaps crucial for clinical assessment.  
- **Therapist-Ready Summaries:** Synthesizes qualitative sessions into structured, professional reports.  
- **The Warm Handoff:** Seamlessly transitions users to a licensed therapist already briefed on their history.

### For Therapists

- **Dashboard:** Manage patients, upcoming appointments, and session documents seamlessly.  
- **RAG AI Chatbot:** Retrieve relevant documents, gain cross-patient insights, and stream actionable output.

---

## Technical Implementation

### Tech Stack

- **Frontend:** React  
- **Backend:** FastAPI  
- **Database:** Supabase, Qdrant  

### AI Architecture & Orchestration

- **Model:** GPT-4.1  
- **Real-Time Voice Conversational Agent:** [OpenAI Real-Time SDK](https://developers.openai.com/api/docs/guides/realtime)  
- **RAG (Retrieval-Augmented Generation):** Grounded AI responses using a vector database (Qdrant).  
- **Vector Database:** Qdrant for semantic retrieval of clinical knowledge.  

### Conversational Logic & Data

- **Few-Shot Prompting:** Hardcoded clinical examples ensure the AI mirrors professional therapeutic tone.

### Flow

```text
user profiling -> agent customization -> real-time conversation with voice AI agent -> summary generation -> book appointment
````

---

## Project Setup

The project is split into **backend** and **frontend**:

* **Backend:** `app`
* **Frontend:** `frontend/ai-therapist`

### Note on Database & Vector Store Access
This app uses **Supabase** and **Qdrant** for storage and vector search. Only our team’s access keys can connect to these services, so some features (e.g., booking appointments, RAG chatbot, knowledge base management) cannot be fully tested by external users.

The app will run locally, but certain functionality will be limited without the proper credentials.

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/Aboyang/ai-therapist.git
```
2. **Environment Variables**
   Create a `.env` file in the root directory with:

```env
QDRANT_API_KEY=YOUR_QDRANT_API_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
REALTIME_API_KEY=YOUR_REALTIME_API_KEY

SUPABASE_URL=YOUR_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
SUPABASE_BUCKET=patients-summary
```
   Create a `.env` file in the frontend/ai-therapist directory with:

```env
VITE_SUPABASE_URL=YOUR_VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_VITE_SUPABASE_ANON_KEY
```
---

3. **Set up and Run Backend Server**

```bash
python -m venv venv
# macOS/Linux
source venv/bin/activate
# Windows
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

4. **Set up and RUn Frontend**

```bash
cd frontend/ai-therapist
npm install
npm run dev
```
- for theraphist's dashboard, navigate to '/dashboard'


## Impact & Roadmap

### Key Metrics (KPIs)

* **Therapy Conversion Rate:** Percentage of users transitioning from AI dialogue to booking a therapist.
* **Anxiety-to-Disclosure Ratio:** Depth of clinical information gathered relative to user comfort level.
* **Intake Efficiency:** Reduction in sessions required for therapists to establish a comprehensive baseline.

### Future Scope

* **Multimodal Empathy:** Integrate voice-to-text with prosody analysis to detect emotional distress.
* **Predictive Analytics:** Use longitudinal data to identify early markers of social disengagement.
* **Privacy-Preserving Local Inference:** Run LLMs on edge devices for fully private disclosures.
