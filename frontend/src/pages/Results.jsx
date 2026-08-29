import { Link } from "react-router-dom";
import AnalyticsDashboard from "../components/AnalyticsDashboard/AnalyticsDashboard";
import Footer from "../components/Footer/Footer";

export default function Results() {
  let prediction = null;

  try {
    prediction = JSON.parse(sessionStorage.getItem("pawsPrediction") || "null");
  } catch {
    prediction = null;
  }

  if (!prediction) {
    return (
      <>
        <section className="paws-section">
          <div className="container paws-empty-state">
            <p className="paws-eyebrow">No Results Yet</p>
            <h1 className="paws-section-title">
              No project analysis is available.
            </h1>
            <p>
              Submit a project through the analysis form to see cost, time and
              risk predictions.
            </p>
            <Link to="/analyze" className="btn paws-btn-primary">
              Analyze a Project
            </Link>
          </div>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <section className="paws-section paws-results-page">
        <div className="container">
          <AnalyticsDashboard prediction={prediction} />
        </div>
      </section>
      <Footer />
    </>
  );
}
