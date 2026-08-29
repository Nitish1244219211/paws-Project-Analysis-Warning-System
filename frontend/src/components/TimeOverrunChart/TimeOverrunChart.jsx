import { BarChart } from "@mui/x-charts/BarChart";
import { formatDate, formatPercent } from "../../data/projectData";

export default function TimeOverrunChart({ prediction }) {
  const severity =
    prediction.predictedTimeOverrunPercentage > 25
      ? "HIGH"
      : prediction.predictedTimeOverrunPercentage > 10
        ? "MEDIUM"
        : "LOW";
  return (
    <section
      className="paws-card paws-panel"
      aria-labelledby="time-chart-title"
    >
      <div className="paws-panel-header">
        <div>
          <p className="paws-eyebrow mb-1">Schedule outlook</p>
          <h2 id="time-chart-title" className="paws-panel-title">
            Time Overrun
          </h2>
        </div>
        <span className={`risk-badge ${severity}`}>
          {formatPercent(prediction.predictedTimeOverrunPercentage)}
        </span>
      </div>
      <div className="paws-timeline-compare">
        <div className="paws-timeline-row">
          <span>Original commissioning</span>
          <strong>{formatDate(prediction.originalCommissioningDate)}</strong>
        </div>
        <div className="paws-timeline-row">
          <span>Revised commissioning</span>
          <strong>{formatDate(prediction.revisedCommissioningDate)}</strong>
        </div>
      </div>
      <BarChart
        dataset={[
          {
            label: "Predicted delay",
            days: Math.max(0, prediction.predictedTimeOverrunDays),
          },
        ]}
        height={180}
        layout="horizontal"
        yAxis={[{ scaleType: "band", dataKey: "label" }]}
        xAxis={[{ label: "Days delayed" }]}
        series={[
          {
            dataKey: "days",
            label: "Delay",
            valueFormatter: (value) => `${value} days`,
          },
        ]}
        margin={{ left: 100, right: 20, top: 20, bottom: 45 }}
        grid={{ vertical: true }}
        skipAnimation
      />
      <div className="paws-chart-caption">
        Predicted delay:{" "}
        <strong>{prediction.predictedTimeOverrunMonths} months</strong> (
        {prediction.predictedTimeOverrunDays} days).
      </div>
    </section>
  );
}
