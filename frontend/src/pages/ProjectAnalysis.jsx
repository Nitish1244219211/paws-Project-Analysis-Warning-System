import ProjectForm from "../components/ProjectForm/ProjectForm";
import Footer from "../components/Footer/Footer";

export default function ProjectAnalysis() {
  return (
    <>
      <section className="paws-section paws-analysis-page">
        <div className="container" style={{ maxWidth: 1040 }}>
          <p className="paws-eyebrow">Project submission</p>
          <h1 className="paws-section-title">Analyze a Project</h1>
          <p className="paws-page-intro">
            Provide the project inputs below. PAWS validates the values locally
            before sending the request to the Flask prediction API.
          </p>
          <ProjectForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
