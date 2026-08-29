import "../../styles/dashboard.css";

export default function ProjectSummary({ prediction }) {
  return (
    <div className="paws-summary-header">
      <div>
        <p className="paws-eyebrow">Project Analysis Results</p>
        <h1 className="paws-summary-title">{prediction.projectName}</h1>
        <p className="paws-summary-meta">
          {prediction.sector} · {prediction.ministry}
        </p>
      </div>
      {prediction.isDemo && (
        <span className="paws-mock-badge">
          Demo Prediction · Backend unavailable
        </span>
      )}
    </div>
  );
}
