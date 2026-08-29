import ProjectSummary from "../ProjectSummary/ProjectSummary";
import CostOverrunChart from "../CostOverrunChart/CostOverrunChart";
import TimeOverrunChart from "../TimeOverrunChart/TimeOverrunChart";
import RiskScore from "../RiskScore/RiskScore";
import "../../styles/dashboard.css";

export default function AnalyticsDashboard({ prediction }) {
  return (
    <div className="paws-dashboard">
      <ProjectSummary prediction={prediction} />
      <div className="paws-kpi-row">
        <div
          className={`paws-kpi-tile paws-kpi-tile--${prediction.riskLevel.toLowerCase()}`}
        >
          <span className="paws-kpi-label">Risk Score</span>
          <strong>{prediction.riskScore} / 100</strong>
          <span>{prediction.riskLevel} RISK</span>
        </div>
        <div
          className={`paws-kpi-tile paws-kpi-tile--${prediction.predictedCostOverrunPercentage > 25 ? "high" : prediction.predictedCostOverrunPercentage > 10 ? "medium" : "low"}`}
        >
          <span className="paws-kpi-label">Cost Overrun</span>
          <strong>
            {prediction.predictedCostOverrunPercentage.toFixed(1)}%
          </strong>
          <span>
            ₹
            {prediction.predictedCostOverrun.toLocaleString("en-IN", {
              maximumFractionDigits: 1,
            })}{" "}
            Cr predicted
          </span>
        </div>
        <div
          className={`paws-kpi-tile paws-kpi-tile--${prediction.predictedTimeOverrunPercentage > 25 ? "high" : prediction.predictedTimeOverrunPercentage > 10 ? "medium" : "low"}`}
        >
          <span className="paws-kpi-label">Time Overrun</span>
          <strong>{prediction.predictedTimeOverrunMonths} mo</strong>
          <span>
            {prediction.predictedTimeOverrunDays} days predicted delay
          </span>
        </div>
      </div>

      <div className="paws-dashboard-grid paws-dashboard-grid--2">
        <RiskScore prediction={prediction} />
        <section className="paws-card paws-panel paws-result-summary">
          <p className="paws-eyebrow">Prediction summary</p>
          <h2 className="paws-panel-title">What PAWS is flagging</h2>
          <dl>
            <div>
              <dt>Original project cost</dt>
              <dd>₹{prediction.originalCost.toLocaleString("en-IN")} Cr</dd>
            </div>
            <div>
              <dt>Revised project cost</dt>
              <dd>₹{prediction.revisedCost.toLocaleString("en-IN")} Cr</dd>
            </div>
            <div>
              <dt>Predicted additional cost</dt>
              <dd>
                ₹
                {prediction.predictedCostOverrun.toLocaleString("en-IN", {
                  maximumFractionDigits: 1,
                })}{" "}
                Cr
              </dd>
            </div>
            <div>
              <dt>Predicted schedule delay</dt>
              <dd>{prediction.predictedTimeOverrunMonths} months</dd>
            </div>
          </dl>
        </section>
      </div>

      <div
        id="analytics"
        className="paws-dashboard-grid paws-dashboard-grid--2"
      >
        <CostOverrunChart prediction={prediction} />
        <TimeOverrunChart prediction={prediction} />
      </div>
    </div>
  );
}
