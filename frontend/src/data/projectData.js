import sectors from "./sectors.json";
import ministries from "./ministries.json";

export const SECTORS = sectors;
export const MINISTRIES = ministries;

export function getSectors() {
  return SECTORS;
}

export function getMinistries() {
  return MINISTRIES;
}

export function isValidSector(sector) {
  return SECTORS.includes(sector);
}

export function isValidMinistry(ministry) {
  return MINISTRIES.includes(ministry);
}

export function validateProjectForm(form) {
  const errors = {};
  const warnings = {};

  if (!isValidSector(form.sector)) errors.sector = "Select a valid sector from the list.";
  if (!isValidMinistry(form.ministry)) errors.ministry = "Select a valid ministry from the list.";

  if (!form.sanctionDate) errors.sanctionDate = "Sanction date is required.";
  if (!form.originalCommissioningDate) errors.originalCommissioningDate = "Original commissioning date is required.";
  if (!form.revisedCommissioningDate) errors.revisedCommissioningDate = "Revised commissioning date is required.";

  const sanction = form.sanctionDate ? new Date(form.sanctionDate) : null;
  const originalDate = form.originalCommissioningDate ? new Date(form.originalCommissioningDate) : null;
  const revisedDate = form.revisedCommissioningDate ? new Date(form.revisedCommissioningDate) : null;

  if (originalDate && sanction && originalDate <= sanction) {
    errors.originalCommissioningDate = "Must be after the sanction date.";
  }
  if (revisedDate && sanction && revisedDate <= sanction) {
    errors.revisedCommissioningDate = "Must be after the sanction date.";
  }
  if (originalDate && revisedDate && revisedDate < originalDate) {
    errors.revisedCommissioningDate = "Must not be earlier than the original commissioning date.";
  }

  const progress = Number(form.progressPercentage);
  if (form.progressPercentage === "" || Number.isNaN(progress)) {
    errors.progressPercentage = "Progress percentage is required.";
  } else if (progress < 0 || progress > 100) {
    errors.progressPercentage = "Must be between 0 and 100.";
  }

  const originalCost = Number(form.originalCost);
  if (form.originalCost === "" || Number.isNaN(originalCost) || originalCost <= 0) {
    errors.originalCost = "Enter a positive original project cost.";
  }

  const revisedCost = Number(form.revisedCost);
  if (form.revisedCost === "" || Number.isNaN(revisedCost) || revisedCost <= 0) {
    errors.revisedCost = "Enter a positive revised project cost.";
  } else if (!Number.isNaN(originalCost) && revisedCost < originalCost) {
    warnings.revisedCost = "Revised cost is below the original cost. This is unusual, but the value will still be submitted for backend evaluation.";
  }

  const expenditure = Number(form.expenditureTillDate);
  if (form.expenditureTillDate === "" || Number.isNaN(expenditure) || expenditure < 0) {
    errors.expenditureTillDate = "Enter a non-negative expenditure amount.";
  }

  return { valid: Object.keys(errors).length === 0, errors, warnings };
}

export function formatCrore(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  return `₹${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 1 })} Cr`;
}

export function formatPercent(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return "—";
  const num = Number(value);
  return `${num > 0 ? "+" : ""}${num.toFixed(digits)}%`;
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "2-digit" });
}

export const EMPTY_PROJECT_FORM = {
  projectName: "",
  sector: "",
  ministry: "",
  sanctionDate: "",
  originalCommissioningDate: "",
  revisedCommissioningDate: "",
  progressPercentage: "",
  expenditureTillDate: "",
  originalCost: "",
  revisedCost: "",
};
