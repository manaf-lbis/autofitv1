import axios from "axios";
import { IGoogleMapRepository } from "./interfaces/IGoogleMapRepository"; 
import { ApiError } from "../utils/apiError";

export class GoogleMapRepository implements IGoogleMapRepository {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.GOOGLE_MAPS_API_KEY!;
  }

  async getDistanceMatrix( origin: { lat: number; lng: number }, destinations: { lat: number; lng: number }[]): Promise<{ distances: number[]; durations: number[] }> {
    const origins = `${origin.lat},${origin.lng}`;
    const destinationStr = destinations.map((d) => `${d.lat},${d.lng}`).join("|");
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json`;

    try {
      const response = await axios.get(url, {
        params: {
          origins,
          destinations: destinationStr,
          key: this.apiKey,
        },
      });

      if (response.data.status !== "OK") {
        const errorMsg = response.data.error_message || response.data.status;
        throw new ApiError(`Google API error: ${errorMsg}`);
      }

      if (!response.data.rows || response.data.rows.length === 0) {
        throw new ApiError("Google API error: No rows returned in the response.");
      }

      const row = response.data.rows[0];
      if (!row.elements || row.elements.length === 0) {
        throw new ApiError("Google API error: No elements returned in the rows.");
      }

      const distances = row.elements.map((el: any) =>
        el.distance && el.distance.value != null ? el.distance.value : -1
      ); 

      const durations = row.elements.map((el: any) =>
        el.duration && el.duration.value != null ? el.duration.value : -1
      );

      return { distances, durations };
      
    } catch (error: any) {
      throw new Error(`Failed to fetch distance matrix data: ${error.message}`);
    }
  }
}

