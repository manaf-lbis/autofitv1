import { ServiceType } from "../types/services";

export function generateBookingId(service: ServiceType): string {

  const prefixes: Record<ServiceType, string> = {
    pretrip: "PRE",
    liveAssistance: "LIV",
    roadside: "RSA",
  };

  const now = new Date();
  const timestamp =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const randomNum = Math.floor(100 + Math.random() * 900);

  return `${prefixes[service]}-${timestamp}-${randomNum}`;
}
