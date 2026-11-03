#!/usr/bin/env bash
# Run from the root of a clean, up-to-date clone of sha728/PackVoted:
#   bash /path/to/handoff/packvoted/apply.sh /path/to/handoff/packvoted
set -euo pipefail
SRC="${1:?pass the handoff/packvoted folder}"

cp "$SRC/README.md" README.md

# Stop tracking the committed virtualenv (~30 MB, 1,155 files) and the log dump.
git rm -r -q --cached venv backend_logs.txt
git mv scrapin.py scrape_holidify.py

cat >> .gitignore <<'EOF'
venv/
.venv/
*.log
backend_logs.txt
__pycache__/
EOF

git add -A
git commit -m "Add README, stop tracking venv and logs, rename scraper

- README: problem, scoring and fairness method, stack, how to run
- remove the committed venv/ and backend_logs.txt from version control
- rename scrapin.py to scrape_holidify.py"
echo "Done. Local venv/ and backend_logs.txt are kept on disk, only untracked."
echo "Review with 'git show --stat | tail', then 'git push'."
