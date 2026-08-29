import { BarChart } from "@mui/x-charts/BarChart";
import { formatCrore, formatPercent } from "../../data/projectData";

export default function CostOverrunChart({ prediction }) {
  const dataset = [
    { label: "Original Cost", value: prediction.originalCost },
    { label: "Revised Cost", value: prediction.revisedCost },
    { label: "Predicted Cost", value: prediction.predictedFinalCost },
  ];
  return (
    <section
      className="paws-card paws-panel"
      aria-labelledby="cost-chart-title"
    >
      <div className="paws-panel-header">
        <div>
          <p className="paws-eyebrow mb-1">Financial outlook</p>
          <h2 id="cost-chart-title" className="paws-panel-title">
            Cost Overrun
          </h2>
        </div>
        <span
          className={`risk-badge ${prediction.predictedCostOverrunPercentage > 25 ? "HIGH" : prediction.predictedCostOverrunPercentage > 10 ? "MEDIUM" : "LOW"}`}
        >
          {formatPercent(prediction.predictedCostOverrunPercentage)}
        </span>
      </div>
      <BarChart
        dataset={dataset}
        height={280}
        layout="horizontal"
        yAxis={[{ scaleType: "band", dataKey: "label" }]}
        xAxis={[{ label: "₹ Crore" }]}
        series={[
          {
            dataKey: "value",
            label: "Project cost",
            valueFormatter: (value) => formatCrore(value),
          },
        ]}
        margin={{ left: 120, right: 20, top: 20, bottom: 45 }}
        grid={{ vertical: true }}
        skipAnimation
      />
      <div className="paws-chart-caption">
        Predicted final cost includes the modelled overrun relative to the
        original project cost.
      </div>
    </section>
  );
}
