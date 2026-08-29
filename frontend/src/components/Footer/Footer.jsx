import "../../styles/footer.css";

export default function Footer() {
  return (
    <footer className="paws-footer">
      <div className="paws-tricolour-rule" />
      <div className="container paws-footer-inner">
        <div>
          <div
            className="paws-brand-name"
            style={{ color: "var(--paws-white)" }}
          >
            PAWS
          </div>
          <p className="paws-footer-tagline">
            Project Analytics &amp; Warning System
          </p>
        </div>
        <div className="paws-footer-cols">
          <div>
            <h4>Platform</h4>
            <a href="/">Home</a>
            <a href="/analyze">Analyze a Project</a>
            <a href="#about-paws">About PAWS</a>
          </div>
          <div>
            <h4>Data</h4>
            <span>186 agencies monitored</span>
            <span>22 sectors monitored</span>
            <span>17 ministries covered</span>
          </div>
          <div>
            <h4>Status</h4>
            <span>PAWS can predict Cost Overrun with 81% accuracy <br/>& <br/>Time Overrun with 91% accuracy</span>
          </div>
        </div>
      </div>
      <div className="container">
        <p className="paws-footer-fine">
          PAWS is a project-monitoring analytics concept and is not an official
          Government of India system.
        </p>
      </div>
    </footer>
  );
}
