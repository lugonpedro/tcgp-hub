export function formatToDate(date: Date | string, type?: "full" | "date" | "time") {
  if (!type || type === "full") {
    return new Date(date).toLocaleString("pt-br");
  }

  if (type === "date") {
    return new Date(date).toLocaleDateString("pt-br");
  }

  if (type === "time") {
    return new Date(date).toLocaleTimeString("pt-br");
  }
}
