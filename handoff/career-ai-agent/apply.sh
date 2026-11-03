#!/usr/bin/env bash
# Run from the root of a clean, up-to-date clone of sha728/Career-Ai-Agent:
#   bash /path/to/handoff/career-ai-agent/apply.sh /path/to/handoff/career-ai-agent
set -euo pipefail
SRC="${1:?pass the handoff/career-ai-agent folder}"

cp "$SRC/README.md" README.md
mkdir -p .github/workflows
cp "$SRC/.github/workflows/ci.yml" .github/workflows/ci.yml

# modules/github_analyzer.py imports dotenv, but it was missing from requirements.
grep -qx 'python-dotenv' requirements.txt || echo 'python-dotenv' >> requirements.txt
# pandas, numpy and scikit-learn are listed but never imported.
sed -i.bak '/^pandas$/d;/^numpy$/d;/^scikit-learn$/d' requirements.txt && rm -f requirements.txt.bak

# Stop tracking bytecode and run output. memory.json holds a previous run's
# GitHub analysis of another person's account.
git rm -r -q --cached --ignore-unmatch app/__pycache__ modules/__pycache__ memory/memory.json memory/user_state.json
cat >> .gitignore <<'EOF'
__pycache__/
*.pyc
.venv/
memory/*.json
EOF

git add -A
git commit -m "Describe the system accurately, add CI, fix requirements

- README: rule-based roadmap with a template explanation; no LLM or RAG
- CI: ruff syntax/undefined-name checks and compileall (ci.yml was empty)
- requirements: add python-dotenv (imported), drop unused pandas, numpy, scikit-learn
- stop tracking __pycache__ and memory/*.json"
echo "Done. Review with 'git show --stat', then 'git push'."
