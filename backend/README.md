# PAWS Flask Backend

Minimal Flask API for the supplied PAWS Random Forest models.

Run:

```bash
pip install -r requirements.txt
python app.py
```

Endpoint:

`POST /api/predict`

The endpoint validates the form payload, engineers the model features, runs both supplied `.pkl` models, and returns cost overrun, time overrun, and a simple risk score.
