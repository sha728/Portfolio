# Career AI Agent

Upload a PDF résumé and get a prioritised learning roadmap. The app extracts your skills from the
résumé, checks your public GitHub activity, infers the role you fit best, and ranks the skills you
should work on next.

It is a classical NLP + rule-based system. There is **no LLM and no retrieval (RAG)** in it: the
roadmap comes from scoring rules, and the "mentor" explanation is a fixed text template.

## How it works

```
PDF résumé ──► text (PyPDF2)
           ──► candidate skill phrases (spaCy noun/proper-noun chunks, en_core_web_sm)
           ──► normalised skills (Sentence-Transformers all-MiniLM-L6-v2,
               cosine similarity ≥ 0.6 against data/skill_ontology.txt)
           ──► GitHub username found in the résumé
           ──► GitHub REST API: repo count, languages, recent activity
               (skills seen in your repos are raised to "High" confidence)
           ──► role inference (largest overlap with each role's skill map)
           ──► roadmap: skills ordered by confidence, role weight and an
               activity penalty, each with an estimated number of weeks
           ──► Streamlit dashboard
```

| Module | What it does |
|---|---|
| `modules/resume_parser.py` | PDF text extraction, spaCy phrase extraction, education and GitHub-username detection |
| `modules/embeddings.py` | Maps extracted phrases onto the skill ontology with Sentence-Transformers |
| `modules/github_analyzer.py` | GitHub REST API calls, language statistics, activity level, safe fallback when a user is missing or the API limit is hit |
| `app/recommender.py` | Role inference and the rule-based roadmap scoring |
| `app/llm_explainer.py` | Template sentence explaining the roadmap (no model call) |
| `app/agent.py` | Runs the pipeline and keeps the last run in `memory/memory.json` |
| `app/ui.py` | Streamlit UI |

## Tech stack

Python · spaCy · Sentence-Transformers · PyPDF2 · GitHub REST API · Streamlit

## Setup

Requires Python 3.10+.

```bash
git clone https://github.com/sha728/Career-Ai-Agent.git
cd Career-Ai-Agent
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

Optional: a GitHub token raises the API rate limit. Put it in a `.env` file in the project root:

```
GITHUB_TOKEN=your_token_here
```

Run the app:

```bash
streamlit run app/ui.py
```

A sample résumé is in `data/resumes/sample_resume.pdf`.

## Limitations

- Skill extraction is phrase-based, so unusual résumé layouts can produce noisy candidates; the
  similarity threshold filters most of them.
- Role profiles and weights in `app/recommender.py` are hand-written, not learned from data.
- The explanation text is a template. Replacing it with an LLM call is a possible next step.

## Author

Shaik Shahid Hussain · [GitHub](https://github.com/sha728) · [LinkedIn](https://www.linkedin.com/in/shahid-s/)
