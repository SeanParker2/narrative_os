# Narrative OS: AI Architecture & Technical Whitepaper

**Version**: 2.0 (Detailed Implementation Guide)  
**Status**: Production Ready (100% Real Data / No Mocks)

This document provides a comprehensive technical breakdown of how Narrative OS leverages Artificial Intelligence to transform unstructured financial data into actionable intelligence. It details the exact data pipelines, AI interactions, and automation strategies for every core feature.

---

## 1. System Overview: The "Data-to-Wisdom" Pipeline

The system operates on a continuous loop of **Ingestion -> Extraction -> Clustering -> Analysis -> Simulation**.

| Stage | Feature | AI Role | Automation |
| :--- | :--- | :--- | :--- |
| **L1** | **Ingestion & Extraction** | Structured Data Extraction (NER, Sentiment) | Cron Job (Every 10m) |
| **L2** | **Clustering & Indexing** | Semantic Grouping & Pattern Recognition | Cron Job (Post-Ingestion) |
| **L3** | **Daily Briefing** | Synthesis & Summarization | On-Demand (Real-time Context) |
| **L4** | **Deep Dive Reports** | Deep Research & Reasoning | On-Demand + Caching |
| **L5** | **Wargame Simulation** | Role-Playing & Dialectic Debate | On-Demand |

---

## 2. Layer 1: Perception (Ingestion & Extraction)

This layer is responsible for "reading" the news and converting raw text into database records.

### 2.1 The Data Pipeline
1.  **Source**: `fetch36Kr`, `fetchCailianshe` (in `src/ingestion/news.ts`) scrape raw news headlines.
2.  **Cleaning**: `cleanText` removes HTML tags and irrelevant noise.
3.  **Storage**: Raw text is saved to the `raw_text` table in SQLite.
4.  **Trigger**: `IngestionService` runs a **Cron Job** every 10 minutes.

### 2.2 AI Interaction: Narrative Extraction
*   **Module**: `src/ai/extractNarrative.ts`
*   **Trigger**: Immediately after a `raw_text` record is created.
*   **Model**: **DeepSeek-V3**
*   **Parameters**: `temperature: 0.1` (Strict, deterministic output).
*   **Prompt Strategy**:
    *   **System Persona**: "Financial Narrative Intelligence Analyst".
    *   **Constraint**: **JSON Mode Enforced**. The model is explicitly instructed to return *only* a valid JSON object, no markdown.
    *   **Taxonomy**: Sentiment is restricted to `["Bullish", "Bearish", "Neutral"]` to ensure downstream statistical consistency.
*   **Output Transformation**:
    *   The JSON response is parsed into a `NarrativeUnitResult` object.
    *   Entities and Keywords are stored as JSON strings in the `narrative_unit` table.

---

## 3. Layer 2: Cognition (Clustering & Indexing)

This layer organizes scattered information into coherent "Narratives".

### 3.1 Clustering Algorithm
*   **Module**: `src/clustering/clusteringService.ts`
*   **Logic**:
    1.  Fetches `NarrativeUnit`s from the last 24 hours.
    2.  Uses a **Keyword Overlap** algorithm (Jaccard Similarity equivalent) to group units.
    3.  If Unit A shares >30% keywords with Cluster B, it joins Cluster B.
    4.  If no match is found, a new Cluster is created.
*   **Automation**: Runs as part of the ingestion pipeline.

### 3.2 Knowledge Graph Construction
*   **Module**: `src/api/routes.ts` (`/narratives/map`)
*   **Data Source**: `NarrativeUnit` table (`entities` column).
*   **Logic**:
    *   **Nodes**: Clusters (Blue) + Entities (Green).
    *   **Links**: Created whenever an Entity appears inside a Cluster's unit.
    *   **Real-time**: The graph is built dynamically on every API request, reflecting the absolute latest state of the database.

---

## 4. Layer 3: Synthesis (Daily Briefing)

This layer acts as the "Chief Market Strategist", providing a high-level view.

### 4.1 Implementation
*   **Module**: `src/ai/briefingService.ts`
*   **Trigger**: User loads the Dashboard (Frontend calls `/api/briefing`).
*   **Data Context**:
    *   Fetches the Top 5 active `NarrativeCluster`s.
    *   Concatenates their names and descriptions into a single context string.

### 4.2 AI Interaction
*   **Model**: **DeepSeek-V3**
*   **Parameters**: `temperature: 0.7` (Creative, fluent writing).
*   **Prompt Strategy**:
    *   **Persona**: "Chief Market Strategist".
    *   **Format**: Markdown.
    *   **Structure**: Forced headers (`Macro View`, `Key Drivers`, `Strategic Outlook`).
*   **Result**: A concise, professional-grade market summary displayed in the "Briefing Card".

---

## 5. Layer 4: Deep Analysis (Deep Dive Reports)

This layer provides institutional-grade research on specific themes.

### 5.1 The "Read-Through Caching" Architecture
To balance cost and speed, this feature uses a smart caching strategy:
1.  **Request**: User clicks a narrative card -> `GET /api/narratives/:id/report`.
2.  **Cache Check**: Backend checks `NarrativeCluster.report_content`.
    *   If exists AND `report_updated_at` < 24 hours: **Return Cached Report** (Sub-millisecond latency).
3.  **Generation (Cache Miss)**:
    *   Fetch **ALL** `NarrativeUnit`s associated with the cluster (up to 30 items).
    *   Construct a **Long-Context Prompt** containing chronological headlines.
    *   Call AI.
    *   **Save** result to DB.
    *   Return result.

### 5.2 AI Interaction
*   **Module**: `src/ai/deepDiveService.ts`
*   **Prompt Strategy**: "Chain-of-Thought" Analysis.
    *   The model is asked to reconstruct the **Timeline**, identify **Key Stakeholders**, and analyze the **Central Conflict**.
    *   This forces the AI to "think" before writing the summary.

---

## 6. Layer 5: Simulation (The Arena / Wargame)

This is the most advanced layer, introducing "Dialectic Intelligence".

### 6.1 Concept
Instead of a static report, the system simulates a debate between opposing viewpoints to reveal hidden risks.

### 6.2 Implementation
*   **Module**: `src/ai/wargameService.ts`
*   **Trigger**: User clicks "Wargame" tab in the report modal.
*   **AI Interaction**:
    *   **Prompt**: "Multi-Persona Simulation". The AI is instructed to generate a script for 3 characters:
        1.  🔴 **Dr. Bull**: Optimist, growth-focused.
        2.  🔵 **Mr. Bear**: Cynical, risk-focused.
        3.  ⚖️ **Arbiter**: Neutral judge.
    *   **Output Format**: **JSON Script**.
        ```json
        {
          "turns": [
            { "speaker": "Dr. Bull", "content": "..." },
            { "speaker": "Mr. Bear", "content": "..." }
          ],
          "verdict": "..."
        }
        ```
*   **Frontend**: Parses the JSON and renders it as a chat-style interface (`WargameView.tsx`).

---

## 7. Operational Integrity

### No-Mock Guarantee
*   **Audit**: All API endpoints (`/alerts`, `/briefing`, `/wargame`) have been audited.
*   **Logic**: If data is insufficient (e.g., no alerts), the system returns an empty state, NEVER fake data.
*   **Verification**: The "Sparklines" in the dashboard are drawn from real historical `NarrativeIndex` data points.

### Manual Control
*   **Command Nexus**: Users can trigger a system-wide refresh via `Cmd+K` -> "Trigger System Refresh".
*   **Feedback**: This calls `POST /api/system/refresh`, which manually invokes the `IngestionService`, bypassing the Cron schedule for immediate updates.
