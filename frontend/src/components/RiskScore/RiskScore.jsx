import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";

const copy = {
  LOW: "Within the lower-risk range based on the submitted project indicators.",
  MEDIUM: "Warning indicators are present and merit closer review.",
  HIGH: "Significant cost, schedule or progress risk is indicated.",
};

export default function RiskScore({ prediction }) {
  const level = prediction.riskLevel || "LOW";
  const tone =
    level === "HIGH"
      ? "var(--paws-red-600)"
      : level === "MEDIUM"
        ? "var(--paws-saffron-500)"
        : "var(--paws-green-500)";
  return (
    <section
      className="paws-card paws-panel paws-risk-panel"
      aria-labelledby="risk-title"
    >
      <div>
        <p className="paws-eyebrow mb-1">Overall assessment</p>
        <h2 id="risk-title" className="paws-panel-title">
          Project Risk Score
        </h2>
      </div>
      <div className="paws-risk-gauge-wrap">
        <Gauge
          width={210}
          height={170}
          value={prediction.riskScore}
          valueMin={0}
          valueMax={100}
          startAngle={-110}
          endAngle={110}
          text={({ value }) => `${value}`}
          skipAnimation
          sx={{
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 34,
              fontFamily: "var(--paws-font-display)",
              fontWeight: 700,
              fill: "var(--paws-navy-950)",
            },
            [`& .${gaugeClasses.valueArc}`]: { fill: tone },
            [`& .${gaugeClasses.referenceArc}`]: { fill: "var(--paws-line)" },
          }}
        />
        <div className="paws-risk-copy">
          <span className={`risk-badge ${level}`}>{level} RISK</span>
          <p>{copy[level]}</p>
        </div>
      </div>
    </section>
  );
}
