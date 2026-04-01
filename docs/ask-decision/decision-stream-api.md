# Decision Stream API Documentation

> **Target audience:** Frontend engineers integrating with the Decision Ask Stream endpoint.
> **Relevant for:** OpenUI (`@openuidev/react-ui`) rendering — especially chart/diagram components.

---

## Endpoint

```
GET /api/decisions/ask
```

**Response type:** `text/event-stream` (Server-Sent Events / SSE)

### Query Parameters

| Parameter        | Type    | Required | Default | Description |
|-----------------|---------|----------|---------|-------------|
| `question`      | string  | Yes      | —       | User's question (5–500 characters, min 5 words) |
| `session_id`    | string  | Yes      | —       | Conversation session identifier |
| `lang`          | string  | No       | `"id"`  | Response language: `"id"` (Indonesian) or `"en"` (English) |
| `model`         | string  | No       | `"anthro"` | LLM model: `"anthro"` (Anthropic) or `"oai"` (OpenAI) |
| `include_final` | boolean | No       | `false` | Include full compiled answer in closing event |
| `disable_cache` | boolean | No       | `false` | Bypass response cache |
| `mock`          | boolean | No       | `false` | Return mock data (dev only) |

### Request Validation

- `question` must be at least **5 words**
- `question` must not exceed **500 characters**
- `session_id` must not be empty
- Users with exhausted daily quota receive HTTP 429

---

## SSE Event Format

All events follow the SSE standard:

```
data: {"key": "value", ...}\n\n
```

Each event is a JSON object. **There is no `event:` type field** — differentiate events by inspecting the keys present.

---

## Event Types

### 1. Preamble (Loading State)

Emitted throughout processing to indicate the current backend step. Use these to drive a progress/loading UI.

**Keys:** `answer`, `is_preamble`

```json
{
  "answer": "Memahami konteks pertanyaan...",
  "is_preamble": true
}
```

| Field        | Type    | Value  |
|-------------|---------|--------|
| `answer`    | string  | Human-readable progress message |
| `is_preamble` | boolean | Always `true` |

**Preamble message labels** (the `answer` value corresponds to these internal states):

| Internal State              | Meaning |
|----------------------------|---------|
| `understanding_context`     | Parsing the question |
| `validating_legal_context`  | Checking legal relevance |
| `classifying_query`         | Determining processing pathway |
| `checking_relevancy`        | Checking against prior conversation |
| `rewriting_query`           | Rewriting ambiguous query |
| `decomposing_query`         | Breaking compound question |
| `disambiguating_query`      | Resolving ambiguous reference |
| `paraphrasing_question`     | Paraphrasing for clarity |
| `searching_decisions`       | Searching court decisions |
| `categorizing_decisions`    | Grouping results |
| `retrieving_specific_decisions` | Fetching referenced decisions |
| `retrieving_decisions`      | Fetching decisions for comparison |
| `processing_documents`      | Analysing retrieved documents |
| `processing_comparison`     | Preparing comparison |
| `processing_statistical`    | Aggregating statistical data |
| `generating_answer`         | LLM generating response |
| `generating_comparison`     | LLM generating comparison |
| `analyzing_decisions`       | Analysing decisions |
| `analyzing_comparison`      | Analysing comparison |
| `extracting_decisions`      | Extracting decision data |
| `aggregating_results`       | Compiling final results |

---

### 2. Answer Chunk (Streaming Text)

LLM response streamed in small chunks (~8 characters each). Append each chunk to build the displayed answer.

**Keys:** `answer`, `source`, `paraphrase_question`

```json
{
  "answer": "Berdasarkan putusan",
  "source": "",
  "paraphrase_question": ""
}
```

| Field               | Type   | Value during streaming |
|--------------------|--------|------------------------|
| `answer`           | string | Partial answer text chunk |
| `source`           | string | Empty `""` during streaming |
| `paraphrase_question` | string | Empty `""` during streaming |

> **Detection:** `is_preamble` is absent, `answer` is non-empty, `source` is `""`.

---

### 3. Closing Event (Final / End of Stream)

Signals end of stream. Contains source citations and optionally the full compiled answer.

**Keys:** `answer`, `source`, `paraphrase_question` (+ optional fields)

```json
{
  "answer": "",
  "source": "https://www.hukumonline.com/pusatdata/detail/guid1,https://www.hukumonline.com/pusatdata/detail/guid2",
  "paraphrase_question": "Pertanyaan yang telah diproses untuk pencarian...",
  "final_answer": "Jawaban lengkap seluruhnya...",
  "query_labels": ["B-01", "legal_domain"]
}
```

| Field               | Type     | Always present | Description |
|--------------------|----------|----------------|-------------|
| `answer`           | string   | Yes            | Always `""` (answer was already streamed in chunks) |
| `source`           | string   | Yes            | Comma-separated decision URLs, or `""` if none |
| `paraphrase_question` | string | Yes          | Rewritten/processed question used for retrieval |
| `final_answer`     | string   | Only if `include_final=true` | Full compiled answer text |
| `query_labels`     | string[] | Only if `include_final=true` | Internal pathway classification labels |
| `statistical_result` | object | Only on Statistical pathway | See section below |

> **Detection:** `answer` is `""` and `source` field is present (even if empty).

#### Source URL format

```
https://www.hukumonline.com/pusatdata/detail/{guid}
```

Multiple sources are comma-separated (no spaces):

```
https://...guid1,https://...guid2,https://...guid3
```

---

### 4. Statistical Result (PATH D only)

> **Note (current implementation scope):** `statistical_result` requires `include_final=true` and is not used in the current FE implementation. Charts and diagrams are currently delivered via **Mermaid code blocks embedded in regular answer chunks** (see Mermaid section). `statistical_result` is documented here for completeness and future use.

The closing event for statistical/aggregate queries includes an additional `statistical_result` object containing structured aggregation data.

**Only present when:**
- The question is a statistical/aggregate query (e.g., "Berapa banyak putusan mengenai X?")
- `include_final=true` is set

```json
{
  "answer": "",
  "source": "https://www.hukumonline.com/pusatdata/detail/guid1",
  "paraphrase_question": "Berapa banyak putusan kasus pidana tahun 2023?",
  "final_answer": "Berdasarkan analisis data statistik, terdapat 42 putusan...",
  "statistical_result": {
    "aggregation_type": "COUNT",
    "total_count": 42,
    "grouped_results": [
      { "key": "2022", "count": 15 },
      { "key": "2023", "count": 27 }
    ],
    "percentage_results": [
      { "category": "Pidana", "percentage": 65.5 },
      { "category": "Perdata", "percentage": 34.5 }
    ],
    "trend_data": [
      { "period": "Q1-2023", "value": 10 },
      { "period": "Q2-2023", "value": 17 }
    ],
    "comparison_data": [
      { "item1": "Pengadilan Negeri Jakarta", "item2": "Pengadilan Negeri Surabaya", "value": "25 vs 8" }
    ],
    "court_ranking": [
      { "rank": 1, "court": "Pengadilan Negeri Jakarta Pusat", "count": 25 },
      { "rank": 2, "court": "Pengadilan Negeri Surabaya", "count": 8 }
    ],
    "decisions": [
      { "title": "Putusan PN Jakarta No. 123/Pid.B/2023/PN Jkt.Pst", "year": 2023, "ruling": "Terbukti bersalah", "guid": "ma682c63b99b258" }
    ],
    "metadata": {
      "query": "MATCH (d:Decision) WHERE d.year = 2023 RETURN count(d)",
      "csv_data": "Title,Year,Ruling\nPutusan PN ...,2023,Terbukti\n",
      "fallback_reason": null,
      "error": null
    }
  }
}
```

#### `statistical_result` fields

> **Required:** `statistical_result` is **only present when `include_final=true` is passed in the request.** Without it, statistical queries still stream the LLM answer text, but no structured chart data is sent.

| Field               | Type     | Description |
|--------------------|----------|-------------|
| `aggregation_type`  | string (enum) | Type of aggregation (see below) |
| `total_count`       | integer  | Total matching decisions |
| `grouped_results`   | array    | Results grouped by a dimension (e.g., year, court type) |
| `percentage_results`| array    | Percentage breakdown per category |
| `trend_data`        | array    | Temporal/trend data points |
| `comparison_data`   | array    | Side-by-side comparison values |
| `court_ranking`     | array    | Courts ranked by decision count |
| `decisions`         | array    | Sample individual decisions with GUID |
| `metadata`          | object   | Raw query, CSV export, debug info |

#### `aggregation_type` enum values

| Value          | Suggested chart type |
|----------------|---------------------|
| `COUNT`        | Bar chart, number card |
| `PERCENTAGE`   | Pie chart, donut chart |
| `TREND`        | Line chart, area chart |
| `RANKING`      | Horizontal bar chart, leaderboard |
| `DISTRIBUTION` | Histogram, treemap |
| `COMPARISON`   | Grouped bar chart, table |

#### `metadata` sub-fields

| Field            | Type   | Description |
|-----------------|--------|-------------|
| `query`         | string | Raw Cypher/text2cypher query executed |
| `csv_data`      | string | CSV-formatted data for download/export |
| `fallback_reason` | string\|null | Reason if fallback logic was used (e.g., `"empty_result"`) |
| `error`         | string\|null | Error detail if aggregation partially failed |

---

### 5. Suggestion Event (CATEGORIZE pathway only)

Emitted before the closing event when paginated results exist. Appended to the displayed answer.

**Keys:** `answer`, `paraphrase_question`

```json
{
  "answer": "\n4. Apakah ada putusan lain mengenai kasus serupa?\n",
  "paraphrase_question": "Pertanyaan yang diproses..."
}
```

> **Detection:** `is_preamble` absent, `source` absent, `answer` non-empty, `paraphrase_question` present.

---

### 6. Error / No Results Event

Emitted when the question cannot be answered.

**Minimal form** (no documents found):

```json
{
  "answer": "Tidak ada dokumen yang relevan ditemukan"
}
```

**Extended form** (validation / processing error):

```json
{
  "answer": "Pertanyaan tidak valid karena...",
  "source": "",
  "paraphrase_question": "Pertanyaan awal..."
}
```

**PATH C extended form** (traverse, no GUIDs found):

```json
{
  "answer": "Tidak ada putusan yang relevan ditemukan",
  "source": "",
  "original_question": "Pertanyaan user asli...",
  "paraphrase_question": "Pertanyaan yang diproses..."
}
```

---

## Event Detection Summary

Use this logic to classify each incoming SSE event:

```
if event.is_preamble == true
  → Preamble / loading indicator

else if event.answer == "" and event.source is present
  → Closing event (end of stream)
    if event.statistical_result is present → Statistical closing
    else → Standard closing

else if event.source is absent and event.paraphrase_question is present
  → Suggestion chunk (append to answer)

else if event.answer != "" and event.source == ""
  → Answer chunk (append to displayed answer)

else if only event.answer is present
  → Minimal error
```

---

## Processing Pathways & Event Sequence

The backend routes each question through one of these pathways. The FE does not need to know the pathway — it only needs to handle the event types above — but this context helps understand what to expect.

| Pathway | Classification | Triggered by |
|---------|---------------|--------------|
| A-01    | Direct single analysis | Question referencing one specific decision |
| A-02    | Comparison | Question comparing two or more decisions |
| B-01    | Document retrieval (rewrite/decompose) | Ambiguous or compound question |
| B-02    | Categorize | Broad topic question; may paginate |
| C       | Traverse | Question referencing a decision by URL/GUID |
| D       | Statistical | Aggregate/count questions |

### Typical event sequence (B-01 example)

```
→ {is_preamble: true, answer: "Memahami konteks..."}
→ {is_preamble: true, answer: "Memvalidasi konteks hukum..."}
→ {is_preamble: true, answer: "Mengklasifikasikan pertanyaan..."}
→ {is_preamble: true, answer: "Menulis ulang pertanyaan..."}
→ {is_preamble: true, answer: "Mencari putusan..."}
→ {is_preamble: true, answer: "Memproses dokumen..."}
→ {is_preamble: true, answer: "Menyusun jawaban..."}
→ {answer: "Berdasar", source: "", paraphrase_question: ""}  ← chunk
→ {answer: "kan putu", source: "", paraphrase_question: ""}  ← chunk
→ ... (more chunks)
→ {answer: "", source: "https://.../guid1,https://.../guid2", paraphrase_question: "..."}  ← CLOSE
```

---

## Mermaid / Diagram Content

**There is no dedicated diagram event.** When the LLM generates a Mermaid diagram as part of the narrative answer, it arrives **embedded as a markdown code block inside the regular `answer` chunks**:

```json
{ "answer": "```mermaid\ngraph TD\n    A[Start] --> B[End]\n```" }
```

The FE must detect and render Mermaid markdown from the assembled `answer` string after streaming completes (or progressively, if the code block is fully received).

**What this means for the current FE implementation:**
- Assemble `answer` chunks into a full string
- Parse for ` ```mermaid ` blocks and render via a Mermaid renderer component
- This is the **primary chart delivery mechanism** in the current implementation

---

## What Can Be Delivered with the Existing Format

| Capability | Available | Notes |
|-----------|-----------|-------|
| Streaming text answer | Yes | Assemble from `answer` chunks |
| Source citations / links | Yes | Parse `source` comma-separated URLs |
| Loading state / progress steps | Yes | `is_preamble: true` events |
| Full compiled answer (non-streaming) | Yes | Requires `include_final=true` |
| Mermaid diagram / chart rendering | **Yes (primary)** | Embedded in answer text as markdown — FE must parse `\`\`\`mermaid` blocks |
| Streaming text answer | Yes | Assemble from `answer` chunks |
| Source citations / links | Yes | Parse `source` comma-separated URLs |
| Loading state / progress steps | Yes | `is_preamble: true` events |
| Paginated "load more" suggestions | Yes | Suggestion event before closing |
| Statistical counts & aggregations | Not in scope | Requires `include_final=true`; use `statistical_result` — deferred |
| Bar / pie / line chart (structured) | Not in scope | `statistical_result` — deferred |
| Real-time chart updates during streaming | **No** | `statistical_result` only arrives in the final closing event |

---

## Related Endpoint

### `GET /api/decisions/gist/{guid}`

Returns structured detail for a single court decision. Useful for rendering decision detail cards.

```
GET /api/decisions/gist/{guid}
```

**Response:**

```json
{
  "data": {
    "guid": "ma682c63b99b258",
    "title": "Putusan Pengadilan Negeri Denpasar Nomor 1387/Pdt.G/2023/PN Dps",
    "argumentations": [{ "entity": "...", "type": "...", "points": ["..."] }],
    "catchwords": {
      "case_type": "Perdata",
      "plaintiff_name": "...",
      "defendant_name": "...",
      "keywords": ["mediasi", "akta perdamaian"]
    },
    "case_histories": [{ "history_court_type": "...", "history_court_details": [{ "history_court_name": "...", "ruling_summary": "..." }] }],
    "chronologies": ["Pada tanggal 5 Desember 2023..."],
    "considerations": ["Majelis Hakim mempertimbangkan..."],
    "expert_statements": null,
    "parties": [
      { "party_role": "penggugat", "party_members": ["Agung Mulya Kantiana"] },
      { "party_role": "tergugat", "party_members": ["Ir. Setiatno Budiman"] }
    ],
    "references": null,
    "regulations": ["Peraturan Mahkamah Agung Nomor 1 Tahun 2016..."],
    "rulings": [{ "ruling_name": "Pokok Perkara", "ruling_details": ["Menghukum para pihak..."] }]
  }
}
```
