# Serene

**The AI-Mediated Bridge to Mental Health Care**  

Serene is a conversational AI designed to dismantle the "Initiation Barrier" for socially avoidant individuals. It acts as a judgment-free on-ramp that transitions users from isolation to professional therapy.

---

## The Barrier

### The Challenge
For individuals with Avoidant Personality Disorder (AvPD) or severe social anxiety, the first therapy session feels like a high-stakes social performance. This "Psychological Cliff" creates a critical gap: patients seek help but are paralyzed by the fear of being judged by a human stranger.

### The Gap
Standard solutions fail this demographic:  

- **Traditional Therapy:** Requires high-stakes vulnerability with a stranger immediately.  
- **Standard Chatbots:** Lack clinical depth and fail to bridge the user to actual professional care.  

### The Vision
Serene is the **Missing Middle Ground**. It is a low-stakes buffer designed for **Therapeutic Readiness**, not a replacement for human empathy.

---

## Core Features

- **Judgment-Free Clinical Dialogue:** Provides a safe, non-human interface for initial disclosure.  
- **Guided Diagnostic Inquiry:** Adaptive AI surfaces triggers, patterns, and coping gaps crucial for clinical assessment.  
- **Therapist-Ready Summaries:** Synthesizes qualitative sessions into structured, professional reports.  
- **The Warm Handoff:** Seamlessly transitions users to a licensed therapist who arrives briefed on the patient’s history.

---

## 🛠️ Technical Implementation

### 1. AI Architecture & Orchestration
- **Core Engine:** GPT-4.1 as the underlying model.
- **Real Time Voice Convo AI Agent**: OpenAI Real Time SDK
- **RAG (Retrieval-Augmented Generation):**
- **Vector Database:** Qdrant

### 2. Conversational Logic & Data
- **Few-Shot Prompting:** Hardcoded clinical inquiry examples to ensure the AI mirrors professional therapeutic tone.

### 3. System Architecture
```

````

---

## 4. Project Setup

The project is split into **backend** and **frontend**:

- **Backend:** `app`  
- **Frontend:** `frontend/ai-therapist`

### Prerequisites
- Node.js >= 18  
- Python >= 3.10  
- Git  

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-org/serene.git
cd 
````

2. **Set up Backend**

```bash
python -m venv venv
source venv/bin/activate      # macOS/Linux
venv\Scripts\activate         # Windows
pip install -r requirements.txt
```

3. **Set up Frontend**

```bash
cd frontend/ai-therapist
npm install
```

4. **Environment Variables**
   Create a `.env` file in the backend and frontend root with the following keys:

```
QDRANT_API_KEY=
OPENAI_API_KEY=
REALTIME_API_KEY=

SUPABASE_PROJECT_PWD=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET=
```

5. **Run the Project**

```bash
# Backend
uvicorn app.main:app --reload

# Frontend
cd frontend/ai-therapist
npm run dev
```

---

## 5. Impact & Roadmap

### Impact Metrics (KPIs)

* **Therapy Conversion Rate:** % of users who transition from AI dialogue to booking a therapist.
* **Anxiety-to-Disclosure Ratio:** Depth of clinical information gathered vs. user comfort level.
* **Intake Efficiency:** Reduction in sessions needed to establish a comprehensive baseline.

### Future Scope

* **Multimodal Empathy:** Integrate voice-to-text with prosody analysis to detect emotional distress.
* **Predictive Analytics:** Use longitudinal data to detect early markers of social disengagement.
* **EHR Integration:** Build API pipelines for warm handoff to EHR systems like Epic or Cerner.
* **Privacy-Preserving Local Inference:** Run LLMs on edge devices for sensitive disclosures.

---
