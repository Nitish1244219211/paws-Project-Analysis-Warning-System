import ProjectSelector from "./ProjectSelector";
import { validateProjectForm } from "../../data/projectData";
import { submitPrediction, ApiError } from "../../services/predictionApi";
import "../../styles/forms.css";

export default function ProjectForm() {
  // No React state is needed here. The form itself is the state.
  const handleSubmit = async (event) => {
    event.preventDefault();

    const formElement = event.currentTarget;
    const raw = Object.fromEntries(new FormData(formElement).entries());
    const result = validateProjectForm(raw);

    formElement.querySelectorAll(".is-invalid").forEach((element) => {
      element.classList.remove("is-invalid");
    });

    Object.entries(result.errors).forEach(([name, message]) => {
      const input = formElement.elements[name];
      if (!input) return;
      input.classList.add("is-invalid");
      const feedback = input.parentElement?.querySelector(".invalid-feedback");
      if (feedback) feedback.textContent = message;
    });

    const warning = formElement.querySelector("[data-revised-cost-warning]");
    if (warning) {
      warning.textContent = result.warnings.revisedCost || "";
      warning.classList.toggle("d-none", !result.warnings.revisedCost);
    }

    if (!result.valid) return;

    const submitButton = formElement.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = "Analyzing Project...";

    const errorBox = formElement.querySelector("[data-api-error]");
    errorBox.classList.add("d-none");
    errorBox.textContent = "";

    try {
      const prediction = await submitPrediction(raw);
      sessionStorage.setItem("pawsPrediction", JSON.stringify(prediction));
      window.location.assign("/results");
    } catch (error) {
      submitButton.disabled = false;
      submitButton.textContent = "Analyze Project";
      errorBox.textContent =
        error instanceof ApiError
          ? error.message
          : "Something went wrong while analyzing this project.";
      errorBox.classList.remove("d-none");
    }
  };

  return (
    <form className="paws-form paws-card" onSubmit={handleSubmit} noValidate>
      <fieldset className="paws-form-section">
        <legend>
          <span className="paws-form-step">1</span> Project Scope
        </legend>
        <div className="mb-4">
          <label htmlFor="projectName" className="form-label">
            Project Name
          </label>
          <input
            id="projectName"
            name="projectName"
            type="text"
            className="form-control"
            placeholder="Optional project name"
          />
        </div>
        <ProjectSelector />
      </fieldset>

      <fieldset className="paws-form-section">
        <legend>
          <span className="paws-form-step">2</span> Project Timeline
        </legend>
        <div className="row g-4">
          <div className="col-md-4">
            <label htmlFor="sanctionDate" className="form-label">
              Sanction Date <span className="text-danger">*</span>
            </label>
            <input
              id="sanctionDate"
              name="sanctionDate"
              type="date"
              className="form-control"
              required
            />
            <div className="invalid-feedback">Sanction date is required.</div>
          </div>
          <div className="col-md-4">
            <label htmlFor="originalCommissioningDate" className="form-label">
              Original Date of Commissioning{" "}
              <span className="text-danger">*</span>
            </label>
            <input
              id="originalCommissioningDate"
              name="originalCommissioningDate"
              type="date"
              className="form-control"
              required
            />
            <div className="invalid-feedback">
              Original commissioning date is required.
            </div>
          </div>
          <div className="col-md-4">
            <label htmlFor="revisedCommissioningDate" className="form-label">
              Revised Date of Commissioning{" "}
              <span className="text-danger">*</span>
            </label>
            <input
              id="revisedCommissioningDate"
              name="revisedCommissioningDate"
              type="date"
              className="form-control"
              required
            />
            <div className="invalid-feedback">
              Revised commissioning date is required.
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="paws-form-section">
        <legend>
          <span className="paws-form-step">3</span> Financial Information
        </legend>
        <div className="row g-4">
          {[
            ["originalCost", "Original Cost of Project"],
            ["revisedCost", "Revised Cost of Project"],
            ["expenditureTillDate", "Expenditure Till Date"],
          ].map(([name, label]) => (
            <div className="col-md-4" key={name}>
              <label htmlFor={name} className="form-label">
                {label} <span className="text-danger">*</span>
              </label>
              <div className="input-group">
                <span className="input-group-text">₹ Cr</span>
                <input
                  id={name}
                  name={name}
                  type="number"
                  className="form-control"
                  min={name === "expenditureTillDate" ? "0" : "0.01"}
                  step="0.01"
                  inputMode="decimal"
                  required
                />
              </div>
              <div className="invalid-feedback">Enter a valid value.</div>
              {name === "revisedCost" && (
                <div
                  data-revised-cost-warning
                  className="paws-form-warning d-none"
                  role="note"
                />
              )}
            </div>
          ))}
        </div>
      </fieldset>

      <fieldset className="paws-form-section">
        <legend>
          <span className="paws-form-step">4</span> Current Progress
        </legend>
        <div className="row g-4">
          <div className="col-md-6">
            <label htmlFor="progressPercentage" className="form-label">
              Progress Percentage <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <input
                id="progressPercentage"
                name="progressPercentage"
                type="number"
                className="form-control"
                min="0"
                max="100"
                step="1"
                inputMode="numeric"
                placeholder="0–100"
                required
              />
              <span className="input-group-text">%</span>
            </div>
            <div className="invalid-feedback">
              Progress must be between 0 and 100.
            </div>
            <div className="form-text">
              Percentage of physical work completed to date.
            </div>
          </div>
        </div>
      </fieldset>

      <div
        data-api-error
        className="alert alert-danger paws-form-alert d-none"
        role="alert"
      />

      <div className="paws-form-actions">
        <button type="submit" className="btn paws-btn-primary">
          Analyze Project
        </button>
        <p className="paws-form-hint">
          <span className="text-danger">*</span> Required fields. Values are
          engineered into the features expected by the Random Forest models
          before prediction.
        </p>
      </div>
    </form>
  );
}
