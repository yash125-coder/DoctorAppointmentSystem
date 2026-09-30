export function formatDate(date) {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function getInitials(name = "") {
  return name.split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase() || "DR";
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
