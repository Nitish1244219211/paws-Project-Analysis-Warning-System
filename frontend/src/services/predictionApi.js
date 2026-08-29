const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(message, status = 0, details = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function normalizePrediction(data) {
  return {
    projectName: data.projectName || data.project_name || "Untitled Project",
    sector: data.sector,
    ministry: data.ministry,
    originalCost: Number(data.originalCost ?? data.original_cost ?? 0),
    revisedCost: Number(data.revisedCost ?? data.revised_cost ?? 0),
    progressPercentage: Number(
      data.progressPercentage ?? data.physical_progress ?? 0,
    ),
    sanctionDate: data.sanctionDate || data.sanction_date,
    originalCommissioningDate:
      data.originalCommissioningDate || data.original_commissioning_date,
    revisedCommissioningDate:
      data.revisedCommissioningDate || data.revised_commissioning_date,
    predictedCostOverrun: Number(
      data.predictedCostOverrun ??
        data.predicted_cost_overrun ??
        data.costOverrun?.amount ??
        data.cost_overrun?.amount ??
        0,
    ),
    predictedCostOverrunPercentage: Number(
      data.predictedCostOverrunPercentage ??
        data.predicted_cost_overrun_percentage ??
        data.costOverrun?.percentage ??
        data.cost_overrun?.percentage ??
        0,
    ),
    predictedFinalCost: Number(
      data.predictedFinalCost ??
        data.predicted_final_cost ??
        data.costOverrun?.predictedFinalCost ??
        data.cost_overrun?.predicted_final_cost ??
        0,
    ),
    predictedTimeOverrunMonths: Number(
      data.predictedTimeOverrunMonths ??
        data.predicted_time_overrun_months ??
        data.timeOverrun?.months ??
        data.time_overrun?.months ??
        0,
    ),
    predictedTimeOverrunPercentage: Number(
      data.predictedTimeOverrunPercentage ??
        data.predicted_time_overrun_percentage ??
        data.timeOverrun?.percentage ??
        data.time_overrun?.percentage ??
        0,
    ),
    predictedTimeOverrunDays: Number(
      data.predictedTimeOverrunDays ??
        data.predicted_time_overrun_days ??
        data.timeOverrun?.days ??
        data.time_overrun?.days ??
        0,
    ),
    riskScore: Number(
      data.riskScore ?? data.risk_score ?? data.risk?.score ?? 0,
    ),
    riskLevel: String(
      data.riskLevel ?? data.risk_level ?? data.risk?.category ?? "LOW",
    ).toUpperCase(),
    predictionSource: data.predictionSource || data.prediction_source || null,
    engineeredFeatures: data.engineeredFeatures || {},
  };
}

async function request(path, options = {}) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiError(
      "Backend unavailable. Start the Flask API on port 5000.",
      0,
    );
  }

  let body = {};
  try {
    body = await response.json();
  } catch {
    body = {};
  }

  if (!response.ok) {
    throw new ApiError(
      body.error || "The PAWS API returned an error.",
      response.status,
      body.details || {},
    );
  }

  return normalizePrediction(body);
}

export async function submitPrediction(form) {
  const payload = {
    projectName: form.projectName,
    sector: form.sector,
    ministry: form.ministry,
    sanctionDate: form.sanctionDate,
    originalCommissioningDate: form.originalCommissioningDate,
    revisedCommissioningDate: form.revisedCommissioningDate,
    progressPercentage: Number(form.progressPercentage),
    expenditureTillDate: Number(form.expenditureTillDate),
    originalCost: Number(form.originalCost),
    revisedCost: Number(form.revisedCost),
  };

  return request("/predict", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
