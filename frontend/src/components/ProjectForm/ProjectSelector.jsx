import { getMinistries, getSectors } from "../../data/projectData";

export default function ProjectSelector({ errors = {} }) {
  return (
    <div className="row g-4">
      <div className="col-md-6">
        <label htmlFor="sector" className="form-label">
          Sector <span className="text-danger">*</span>
        </label>
        <select
          id="sector"
          name="sector"
          className={`form-select${errors.sector ? " is-invalid" : ""}`}
          defaultValue=""
          required
        >
          <option value="">Select sector</option>
          {getSectors().map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
        {errors.sector && (
          <div className="invalid-feedback">{errors.sector}</div>
        )}
      </div>

      <div className="col-md-6">
        <label htmlFor="ministry" className="form-label">
          Ministry <span className="text-danger">*</span>
        </label>
        <select
          id="ministry"
          name="ministry"
          className={`form-select${errors.ministry ? " is-invalid" : ""}`}
          defaultValue=""
          required
        >
          <option value="">Select ministry</option>
          {getMinistries().map((ministry) => (
            <option key={ministry} value={ministry}>
              {ministry}
            </option>
          ))}
        </select>
        {errors.ministry && (
          <div className="invalid-feedback">{errors.ministry}</div>
        )}
        <div className="form-text">
          Sector and Ministry are independent selections.
        </div>
      </div>
    </div>
  );
}
