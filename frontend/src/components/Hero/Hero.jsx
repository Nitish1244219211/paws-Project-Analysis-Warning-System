import { Link } from "react-router-dom";
import "../../styles/hero.css";

function NetworkGraphic() {
  const nodes = [
    { x: 40, y: 160, r: 6, risk: "low" },
    { x: 130, y: 90, r: 8, risk: "medium" },
    { x: 230, y: 150, r: 10, risk: "high" },
    { x: 330, y: 70, r: 6, risk: "low" },
    { x: 400, y: 130, r: 7, risk: "medium" },
  ];
  const riskColor = {
    low: "var(--paws-green-500)",
    medium: "var(--paws-saffron-500)",
    high: "var(--paws-red-600)",
  };

  return (
    <svg
      viewBox="0 0 460 220"
      className="paws-hero-graphic"
      role="img"
      aria-label="Illustration of infrastructure projects connected in a national network"
    >
      <polyline
        points={nodes.map((node) => `${node.x},${node.y}`).join(" ")}
        fill="none"
        stroke="var(--paws-navy-100)"
        strokeWidth="2"
      />
      {nodes.map((node, index) => (
        <g key={index}>
          <circle
            cx={node.x}
            cy={node.y}
            r={node.r + 7}
            fill={riskColor[node.risk]}
            opacity="0.1"
          />
          <circle
            cx={node.x}
            cy={node.y}
            r={node.r}
            fill={riskColor[node.risk]}
          />
        </g>
      ))}
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="paws-hero">
      <div className="container paws-hero-grid">
        <div>
          <p className="paws-eyebrow">National Project Intelligence Platform</p>
          <h1 className="paws-hero-headline">
            Monitor. Predict. <span className="paws-hero-accent">Prevent.</span>
          </h1>
          <p className="paws-hero-sub">
            PAWS brings project cost, schedule and progress information together
            to identify potential overrun and risk before infrastructure delays
            become expensive.
          </p>
          <div className="paws-hero-actions">
            <Link to="/analyze" className="btn paws-btn-primary">
              Start Analyzing Projects
            </Link>
            <a href="#about-paws" className="btn paws-btn-secondary">
              Learn About PAWS
            </a>
          </div>
          <div className="paws-hero-stats" aria-label="PAWS portfolio coverage">
            <div className="paws-stat">
              <div className="paws-stat-value">22</div>
              <div className="paws-stat-label">Sectors tracked</div>
            </div>
            <div className="paws-stat">
              <div className="paws-stat-value">17</div>
              <div className="paws-stat-label">Ministries listed</div>
            </div>
            <div className="paws-stat">
              <div className="paws-stat-value">
                1775<span className="paws-stat-suffix">+</span>
              </div>
              <div className="paws-stat-label">Projects in portfolio</div>
            </div>
          </div>
        </div>

        <div className="paws-hero-visual">
          <div className="paws-visual-kicker">
            <span className="paws-dot" /> PROJECT ANALYTICS
          </div>
          <NetworkGraphic />
          <div className="paws-hero-visual-caption">
            <span className="risk-badge HIGH">HIGH</span>
            <span>
              Example risk signal across project cost and schedule indicators
            </span>
          </div>
          <p className="paws-hero-visual-footnote">
            Illustrative interface visual. Prediction values come from the
            connected Flask model.
          </p>
        </div>
      </div>
    </section>
  );
}
