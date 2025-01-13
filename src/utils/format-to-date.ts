import { Timestamp } from "firebase/firestore";

export function formatToDate(timestamp: Timestamp, type?: "full" | "date" | "time") {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
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
