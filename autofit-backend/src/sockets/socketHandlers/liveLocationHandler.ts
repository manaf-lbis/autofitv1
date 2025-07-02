import { Socket } from "socket.io";
import { getIO } from "../socket";

const lastLocations = new Map<string, { lat: number; lng: number; timestamp: number }>();

export const liveLocationHandler = (socket: Socket) => {
  socket.on("mechanicLocationUpdate", (data: { bookingId: string; latitude: number; longitude: number }) => {
    const { bookingId, latitude, longitude } = data;
    if (isNaN(latitude) || isNaN(longitude)) {
      console.error("Invalid latitude or longitude for bookingId:", bookingId);
      return;
    }
    lastLocations.set(bookingId, { lat: latitude, lng: longitude, timestamp: Date.now() });
    const room = `live_tracking_${bookingId}`;
    getIO().to(room).emit("mechanicLocationUpdate", { bookingId, latitude, longitude });
  });

  socket.on("requestLastLocation", (data: { bookingId: string }, callback: (response: { lat: number; lng: number; timestamp: number } | null) => void) => {
    const { bookingId } = data;
    const lastLocation = lastLocations.get(bookingId);
    callback(lastLocation && Date.now() - lastLocation.timestamp < 24 * 60 * 60 * 1000 ? lastLocation : null); // Send null if older than 24 hours
  });

  socket.on("disconnect", () => {
    lastLocations.forEach((value, key, map) => {
      if (Date.now() - value.timestamp > 24 * 60 * 60 * 1000) map.delete(key);
    });
  });
};