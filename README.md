# PAWS

Project Analytics & Warning System. 


## Frontend

```bash
cd frontend
npm install
npm start
```

Production build:

```bash
npm run build
```

The frontend uses Create React App, Bootstrap, React Router and MUI X Charts.

Create `frontend/.env` if the Flask API is not running at the default URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Backend

```bash
cd backend
python -m venv .venv
# Windows:
.venv\Scripts\activate
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
python app.py
```

The API runs at `http://localhost:5000`.

Health check:

```text
GET /api/health
```

Prediction:

```text
POST /api/predict
```

## Prediction flow

The React form sends only the values a user actually enters:

```json
{
  "projectName": "Example Project",
  "sector": "Roads & Highways",
  "ministry": "Ministry of Road Transport & Highways",
  "sanctionDate": "2022-01-15",
  "originalCommissioningDate": "2025-01-15",
  "revisedCommissioningDate": "2025-07-15",
  "progressPercentage": 65,
  "expenditureTillDate": 80,
  "originalCost": 100,
  "revisedCost": 120
}
```

The backend then engineers the features required by the supplied models.

### Cost model features

- `orig_cost`
- `phys_progress`
- `planned_duration_days`
- `progress_gap`
- `sanction_month`
- `sanction_year`
- `cost_utilization`
- `cost_per_progress`
- `ministry_loo_cost_overrun_rate`
- `size_decile_in_sector`
- `sector_loo_cost_overrun_rate`

### Time model features

- `orig_cost`
- `phys_progress`
- `planned_duration_days`
- `progress_gap`
- `cost_utilization`
- `cost_per_progress`
- `size_decile_in_sector`
- `sector_hist_time_overrun_rate`

`progress_gap` is derived from the elapsed sanctioned schedule versus reported physical progress. `cost_utilization` is expenditure divided by revised cost. `cost_per_progress` is expenditure divided by physical progress.


## Model files

 `backend/models/`:

- `rf_cost_overrun_pct.pkl`
- `rf_time_overrun_pct.pkl`

They are loaded with Python `pickle`. The requirements use scikit-learn 1.6.1 to match the estimator version reported by the supplied artifacts.

## Response

`POST /api/predict` returns normalized dashboard data such as:

```json
{
  "predictedCostOverrun": 12.5,
  "predictedCostOverrunPercentage": 12.5,
  "predictedFinalCost": 112.5,
  "predictedTimeOverrunMonths": 4.2,
  "predictedTimeOverrunPercentage": 17.1,
  "predictedTimeOverrunDays": 126,
  "riskScore": 72,
  "riskLevel": "HIGH",
  "predictionSource": "random_forest",
  "engineeredFeatures": {}
}
```

The risk score is a simple presentation score based on the two model predictions and `progress_gap`; it is not a third ML model.

## Important implementation choices

- All API routes are in `backend/app.py`.
- The form uses native `FormData`.
- Sector and ministry lists remain independent JSON data.
- MUI X Charts are used for result visualizations.
