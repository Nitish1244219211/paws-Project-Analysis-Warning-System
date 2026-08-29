import os
import numpy as np
import pandas as pd
import pickle
from datetime import datetime, timezone

from flask import Flask, jsonify, request
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models")
DATA_DIR = os.path.join(BASE_DIR, "data")

# Load historical data and models once
df = pd.read_csv(
    os.path.join(DATA_DIR, "decileengineered_projects2.csv")
    )

with open(os.path.join(MODEL_DIR, "rf_cost_overrun_pct.pkl"), "rb") as f:
    cost_model = pickle.load(f)

with open(os.path.join(MODEL_DIR, "rf_time_overrun_pct.pkl"), "rb") as f:
    time_model = pickle.load(f)



DEFAULT_MINISTRY_COST_OVERRUN_RATE = 9.35
DEFAULT_SECTOR_COST_OVERRUN_RATE = 11.0
DEFAULT_SECTOR_TIME_OVERRUN_RATE = 14.0

SECTORS = []
MINISTRIES = []


def load_list(filename):
    path = os.path.join(DATA_DIR, filename)
    if not os.path.exists(path):
        return []
    return pd.read_csv(path).iloc[:, 0].dropna().astype(str).tolist()


SECTORS = load_list("sector.csv")
MINISTRIES = load_list("ministry.csv")


def parse_date(value):
    return datetime.strptime(value, "%Y-%m-%d")

# check the data of i/p and return respective error in a dict
def validate(payload):
    required = [
        "sector",
        "ministry",
        "sanctionDate",
        "originalCommissioningDate",
        "revisedCommissioningDate",
        "progressPercentage",
        "expenditureTillDate",
        "originalCost",
        "revisedCost",
    ]
    # to store upcoming error
    errors = {} # a dictionary

    for field in required:
        if payload.get(field) in (None, ""):
            errors[field] = "This field is required."

    if errors:
        return errors # server side validation

    # check if valid ministry / sector selected
    if payload["sector"] not in SECTORS:
        errors["sector"] = "Select a valid sector."
    if payload["ministry"] not in MINISTRIES:
        errors["ministry"] = "Select a valid ministry."


    # validation 4 dates
    try:
        # parse all type of dates
        sanction = parse_date(payload["sanctionDate"])
        original_date = parse_date(payload["originalCommissioningDate"])
        revised_date = parse_date(payload["revisedCommissioningDate"])

        # sacntion date should be lower than both given dates
        if original_date <= sanction:
            errors["originalCommissioningDate"] = "Must be after the sanction date."
        if revised_date <= sanction:
            errors["revisedCommissioningDate"] = "Must be after the sanction date."
        # revision is entertained only if greater
        if revised_date < original_date:
            errors["revisedCommissioningDate"] = "Must not be earlier than the original commissioning date."
    
    except (ValueError, TypeError):
        errors["dates"] = "Dates must use YYYY-MM-DD format."


    # we want progress in float %age
    try:
        progress = float(payload["progressPercentage"])
        if not 0 <= progress <= 100:
            errors["progressPercentage"] = "Must be between 0 and 100."
    except (ValueError, TypeError):
        errors["progressPercentage"] = "Must be a number."

    # cost validations
    for field in ("originalCost", "revisedCost", "expenditureTillDate"):
        try:
            if float(payload[field]) < 0:
                errors[field] = "Must not be negative."
        except (ValueError, TypeError):
            errors[field] = "Must be a number."

    return errors


# Get the project's sector cost decile.
def size_decile_in_sector(sector, original_cost):
    values = df.loc[df["sector"] == sector, "orig_cost"].dropna()

    if values.empty:
        return 5.0

    rank = (values < original_cost).sum() + 1
    decile = int((rank - 1) / len(values) * 10) + 1

    return float(min(10, max(1, decile)))


# Get historical overrun rate for a group.
def historical_rate(group_col, flag_col, value):
    values = df.loc[df[group_col] == value, flag_col].dropna()

    if values.empty:
        return float(df[flag_col].mean())

    return float(values.mean())

def engineer_features(payload):
    #dates
    sanction = parse_date(payload["sanctionDate"])
    # revised_date = parse_date(payload["revisedCommissioningDate"])
    original_date = parse_date(payload["originalCommissioningDate"])
    #cost
    original_cost = float(payload["originalCost"])
    revised_cost = float(payload["revisedCost"])
    expenditure = float(payload["expenditureTillDate"])

    planned_duration_days = max(1, (original_date - sanction).days)

    physical_progress = float(payload["progressPercentage"])

    ministry = payload['ministry']
    sector = payload['sector']

    # ref pt 
    today = datetime(2026,4,30)

    elapsed_days = max(0, (today - sanction).days)

    expected_progress = min(100.0, 100.0 * elapsed_days / planned_duration_days) # in %age

    progress_gap = max(0.0, expected_progress - physical_progress)

    cost_utilization = expenditure / revised_cost if revised_cost else 0.0

    cost_per_progress = expenditure / physical_progress if physical_progress > 0 else expenditure
    

    return {
        # Cost model features
        "orig_cost": original_cost,
        "phys_progress": physical_progress,
        "planned_duration_days": planned_duration_days,
        "progress_gap": progress_gap,
        "sanction_month": sanction.month,
        "sanction_year": sanction.year,
        "cost_utilization": cost_utilization,
        "cost_per_progress": cost_per_progress,

        "ministry_loo_cost_overrun_rate": historical_rate(
            "ministry",
            "cost_overrun_flag",
            payload["ministry"],
        )*100,
        "size_decile_in_sector": size_decile_in_sector(
            payload["sector"],
            original_cost,
        ),
        "sector_loo_cost_overrun_rate": historical_rate(
            "sector",
            "cost_overrun_flag",
            payload["sector"],
        )*100,
        "sector_hist_time_overrun_rate": historical_rate(
            "sector",
            "time_overrun_flag",
            payload["sector"],
        ),
    }


COST_FEATURES = [
    "orig_cost",
    "phys_progress",
    "planned_duration_days",
    "progress_gap",
    "sanction_month",
    "sanction_year",
    "cost_utilization",
    "cost_per_progress",
    "ministry_loo_cost_overrun_rate",
    "size_decile_in_sector",
    "sector_loo_cost_overrun_rate",
]

TIME_FEATURES = [
    "orig_cost",
    "phys_progress",
    "planned_duration_days",
    "progress_gap",
    "cost_utilization",
    "cost_per_progress",
    "size_decile_in_sector",
    "sector_hist_time_overrun_rate",
]

# payload validated , everything good u can engineer feat
def predict(payload):
    features = engineer_features(payload)
    

    cost_input = [[features[name] for name in COST_FEATURES]]
    time_input = [[features[name] for name in TIME_FEATURES]]

    predicted_cost_pct = float(cost_model.predict(cost_input)[0])
    predicted_time_pct = float(time_model.predict(time_input)[0])

    # Negative overrun is not useful for the dashboard's "additional cost /
    # delay" fields, so clamp predictions to zero after model inference.
    predicted_cost_pct = max(0.0, predicted_cost_pct)
    predicted_time_pct = max(0.0, predicted_time_pct)

    original_cost = float(payload["originalCost"])
    revised_cost = float(payload["revisedCost"])
    planned_days = features["planned_duration_days"]

    predicted_additional_cost = original_cost * predicted_cost_pct / 100.0
    predicted_final_cost = original_cost + predicted_additional_cost

    predicted_delay_days = round(planned_days * predicted_time_pct / 100.0)
    predicted_delay_months = round(predicted_delay_days / 30.0, 1)

    # Keep risk scoring simple and deterministic. It is a presentation score,
    # not a third ML model.
    risk_score = round(
        min(
            100,
            predicted_cost_pct * 0.45
            + predicted_time_pct * 0.35
            + features["progress_gap"] * 0.20,
        )
    )
    risk_level = (
        "HIGH" if risk_score >= 50 else "MEDIUM" if risk_score >= 30 else "LOW"
    )

    return {
        "projectName": payload.get("projectName") or "Untitled Project",
        "sector": payload["sector"],
        "ministry": payload["ministry"],
        "originalCost": original_cost,
        "revisedCost": revised_cost,
        "progressPercentage": float(payload["progressPercentage"]),
        "sanctionDate": payload["sanctionDate"],
        "originalCommissioningDate": payload["originalCommissioningDate"],
        "revisedCommissioningDate": payload["revisedCommissioningDate"],
        "predictedCostOverrun": round(predicted_additional_cost, 2),
        "predictedCostOverrunPercentage": round(predicted_cost_pct, 2),
        "predictedFinalCost": round(predicted_final_cost, 2),
        "predictedTimeOverrunMonths": predicted_delay_months,
        "predictedTimeOverrunPercentage": round(predicted_time_pct, 2),
        "predictedTimeOverrunDays": predicted_delay_days,
        "riskScore": risk_score,
        "riskLevel": risk_level,
        "predictionSource": "random_forest",
        "engineeredFeatures": features,
        "modelFeatures": {
            "cost": COST_FEATURES,
            "time": TIME_FEATURES,
        },
        "featureNote": (
            "Historical leave-one-out rate and sector size-decile values use "
            "explicit neutral baselines because the supplied training "
            "portfolio was not included."
        ),
    }


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


@app.get("/api/health")
def health():
    return jsonify({"status": "ok", "service": "paws-backend"})

# form entries report here
@app.post("/api/predict")
def predict_route():
    # load i/p data without error
    payload = request.get_json(silent=True) or {}

    # validate i/p and return error in dict  with reason
    errors = validate(payload)
    if errors:
        return jsonify({"error": "Validation failed.", "details": errors}), 422

    try:
        return jsonify(predict(payload)), 200 # if goes right send code 200 
    except Exception as exc: # if exception / error store as exc
        return jsonify(
            {"error": f"Prediction failed: {exc}"}
            ), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
