# Mood-Based Book Recommender

Pick how you feel and get the best-rated books that match that mood.

## How it works

1. **Label the books.** Each of the 6,810 book descriptions in `data/books.csv` is classified with
   the pretrained emotion model
   [`j-hartmann/emotion-english-distilroberta-base`](https://huggingface.co/j-hartmann/emotion-english-distilroberta-base)
   (DistilRoBERTa, seven labels: anger, disgust, fear, joy, neutral, sadness, surprise). The model is
   used as-is, not fine-tuned. Labels are cached in the `predicted_emotion` column, so this runs only
   once.
2. **Recommend.** You choose a mood in the Streamlit sidebar. The app keeps the books whose
   predicted emotion matches it and returns the highest-rated ones (`recommender/recommend.py`).

`model/evaluate_model.py` scores the classifier against a labelled test file and saves a confusion
matrix and metric charts to `results/`.

## Tech stack

Python · HuggingFace Transformers (PyTorch backend) · pandas · scikit-learn (metrics) ·
Matplotlib/Seaborn · Streamlit · Docker

## Run

```bash
pip install -r requirements.txt
streamlit run app/app.py
```

Or with Docker:

```bash
docker build -t book-recommender .
docker run -p 9000:9000 book-recommender
```

Then open <http://localhost:9000>. The first run downloads the model from HuggingFace.

## Limitations

- Matching is by a single top emotion label per book, so a book is never recommended for a
  secondary mood.
- Ranking uses only the average rating. Many descriptions are labelled `neutral`.

## Author

Shaik Shahid Hussain · [GitHub](https://github.com/sha728) · [LinkedIn](https://www.linkedin.com/in/shahid-s/)
