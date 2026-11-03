# Handoff: changes for your other repositories

Everything here is ready to apply by hand in the matching repository. This folder is
excluded from the Vercel deploy by `.vercelignore`. Delete it once you've applied the changes.

## 1. Profile README (`sha728/sha728`)

Replace `README.md` in `sha728/sha728` with `profile-readme/README.md`, either through the GitHub
web editor or:

```bash
git clone https://github.com/sha728/sha728 && cd sha728
cp ../Portfolio/handoff/profile-readme/README.md README.md
git commit -am "Rewrite profile README" && git push
```

If any icon in the skillicons row shows as broken, delete that id from the `i=` list. These
could not be previewed from the sandbox.

## 2. Merge gym-management-system `develop` into `main`

`main` has a single commit ("Initialize repository") and `develop` is built on it, so this is a
clean fast-forward:

```bash
git clone https://github.com/sha728/gym-management-system && cd gym-management-system
git checkout main && git merge --ff-only origin/develop && git push origin main
```

Or on GitHub: open a pull request from `develop` into `main` and merge it.

**Before you share this repo, rotate the committed secrets.** `backend/GymApi/appsettings.Development.json`
contains a real-looking JWT signing key and the admin password `Admin@123`. They're dev-only, but
a reviewer will notice. Move them to `dotnet user-secrets` or environment variables, as
`docker-compose.yml` already does.

## 3. Career AI Agent

`career-ai-agent/apply.sh` copies in the new README and CI, and fixes `requirements.txt`. It was
dry-run on a copy of the repo, and the new CI checks pass.

```bash
git clone https://github.com/sha728/Career-Ai-Agent && cd Career-Ai-Agent
bash ../Portfolio/handoff/career-ai-agent/apply.sh ../Portfolio/handoff/career-ai-agent
git push
```

What it changes:
- README describes the real system: spaCy + Sentence-Transformers + GitHub API + rule-based
  roadmap, with an explicit "no LLM, no RAG" line.
- `ci.yml` (was empty): ruff syntax and undefined-name checks plus `compileall`.
- `requirements.txt`: adds `python-dotenv`, which `github_analyzer.py` imports but was missing.
  Removes `pandas`, `numpy` and `scikit-learn`, which the code never imports.
- Stops tracking `__pycache__/` and `memory/*.json`. `memory.json` holds an earlier run's analysis
  of another person's GitHub account (`sanjanavelma`).

## 4. PackVote

```bash
git clone https://github.com/sha728/PackVoted && cd PackVoted
bash ../Portfolio/handoff/packvoted/apply.sh ../Portfolio/handoff/packvoted
git push
```

What it changes: adds the README, untracks `venv/` (1,155 files) and `backend_logs.txt`, renames
`scrapin.py` to `scrape_holidify.py`, and updates `.gitignore`. It was dry-run on a copy.

`venv/` stays in git history, so clone size won't drop unless you rewrite history. That isn't
worth it for 30 MB.

Not changed, but worth fixing before an interviewer opens `main.py`:
- `generate_gemini_itinerary` prints the **first 10 characters of your Gemini API key** to stderr
  on every call.
- `GET /api/debug/env` returns the names of all environment variables, without authentication.
- `auth.py` falls back to `SECRET_KEY = "super-secret-default-key"`.
- `docker-compose.yml` doesn't set `DATABASE_URL`, so the backend container tries `localhost`
  unless `.env` points it at `db`. The new README says so.

## 5. Book Recommendation System (optional)

`book-recommendation-system/README.md` replaces the 2-line README. Copy it in and push.

## 6. Résumé (Overleaf)

`resume/resume.tex` is a complete one-page résumé in pdfLaTeX (Jake's-résumé layout). It could not
be compiled in the sandbox, so compile it on Overleaf and check that it fits on one page. If it
runs over, drop the Book Recommender entry first.

After compiling, download the PDF and replace `assets/docs/resume.pdf` in this portfolio repo.
**Until you do, the portfolio's "Download Resume" button serves the old PDF**, which still says
RAG, AWS, Java, CGPA 7.4 and fine-tuned RoBERTa.

Two `% TODO` comments in the .tex mark the internship start month and your Lawsome bullet.

## 7. GitHub settings (only you can do these)

**Pins** (profile → Customize your pins): QueryMind, PackVoted, Career-Ai-Agent,
Book-Recommendation-System, gym-management-system. Unpin Expense-Tracker and EDA.
If you keep EDA public, fix its description: it says "Major Cities", but the data is India crime
data.

**Bio** (profile → Edit profile), at most 160 characters:

> CSE grad (LPU '26) · Engineering intern @ eTrilliumtech · Text-to-SQL, NLP & full-stack (Python, React, .NET) · QueryMind: 81.1% on Spider dev

**Location:** Bengaluru, India
**Website:** https://portfolio-4aq6.vercel.app
