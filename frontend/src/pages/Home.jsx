import { Link } from "react-router-dom";
import Hero from "../components/Hero/Hero";
import Footer from "../components/Footer/Footer";

const PIPELINE = [
  [
    "01",
    "Submit project data",
    "Enter sector, ministry, dates, cost, expenditure and current physical progress.",
  ],
  [
    "02",
    "Evaluate indicators",
    "PAWS prepares the submitted project data for model-based analysis.",
  ],
  [
    "03",
    "Predict overrun",
    "The Flask API can return predicted cost and schedule overrun.",
  ],
  [
    "04",
    "Assess project risk",
    "A single risk score makes the result easier to review and act on.",
  ],
];

export default function Home() {
  return (
    <>
      <Hero />
      <section id="project-data" className="paws-section">
        <div className="container">
          <p className="paws-eyebrow">Project data</p>
          <h2 className="paws-section-title">
            A structured path from project inputs to a decision-ready result.
          </h2>
          <div className="row g-4">
            {PIPELINE.map(([number, title, body]) => (
              <div className="col-sm-6 col-lg-3" key={number}>
                <article className="paws-pipeline-card h-100">
                  <span className="paws-pipeline-step">{number}</span>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about-paws" className="paws-section paws-about-section">
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <p className="paws-eyebrow">About PAWS</p>
              <h2 className="paws-section-title">
                A public-sector analytics interface built around the questions
                that matter.
              </h2>
              <p className="paws-about-copy">
                PAWS focuses the workflow on three outputs: cost overrun, time
                overrun and project risk. The interface keeps the input data
                explicit so the resulting prediction can be reviewed rather than
                hidden behind a pile of decorative dashboard widgets.
              </p>
              <Link to="/analyze" className="btn paws-btn-primary">
                Analyze a Project
              </Link>
            </div>
            <div className="col-lg-5">
              <div className="paws-about-facts">
                <div>
                  <strong>Cost</strong>
                  <span>Predicted additional project cost</span>
                </div>
                <div>
                  <strong>Time</strong>
                  <span>Predicted schedule delay</span>
                </div>
                <div>
                  <strong>Risk</strong>
                  <span>Low, Medium or High assessment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
