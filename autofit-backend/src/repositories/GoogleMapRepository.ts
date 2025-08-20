// import axios from "axios";
// import { IGoogleMapRepository } from "./interfaces/IGoogleMapRepository"; 
// import { ApiError } from "../utils/apiError";
// import { MAP_DISTANCE_MATRIX_URL } from "../utils/constants";

// export class GoogleMapRepository implements IGoogleMapRepository {
//   private _apiKey: string;

//   constructor() {
//     this._apiKey = process.env.GOOGLE_MAPS_API_KEY!;
//   }

//   async getDistanceMatrix( origin: { lat: number; lng: number }, destinations: { lat: number; lng: number }[]): Promise<{ distances: number[]; durations: number[] }> {
//     const origins = `${origin.lat},${origin.lng}`;
//     const destinationStr = destinations.map((d) => `${d.lat},${d.lng}`).join("|");
//     const url = MAP_DISTANCE_MATRIX_URL;

//     try {
//       const response = await axios.get(url, {
//         params: {
//           origins,
//           destinations: destinationStr,
//           key: this._apiKey,
//         },
//       });

//       if (response.data.status !== "OK") {
//         const errorMsg = response.data.error_message || response.data.status;
//         throw new ApiError(`Google API error: ${errorMsg}`);
//       }

//       if (!response.data.rows || response.data.rows.length === 0) {
//         throw new ApiError("Google API error: No rows returned in the response.");
//       }

//       const row = response.data.rows[0];
//       if (!row.elements || row.elements.length === 0) {
//         throw new ApiError("Google API error: No elements returned in the rows.");
//       }

//       const distances = row.elements.map((el: any) =>
//         el.distance && el.distance.value != null ? el.distance.value : -1
//       ); 

//       const durations = row.elements.map((el: any) =>
//         el.duration && el.duration.value != null ? el.duration.value : -1
//       );

//       return { distances, durations };
      
//     } catch (error: any) {
//       throw new Error(`Failed to fetch distance matrix data: ${error.message}`);
//     }
//   }
// }


    import axios from "axios";
    import { IGoogleMapRepository } from "./interfaces/IGoogleMapRepository";
    import { ApiError } from "../utils/apiError";

    export class GoogleMapRepository implements IGoogleMapRepository {
    private _apiKey: string;
    private _baseUrl: string ;

    constructor() {
      this._apiKey = process.env.GEO_MATRIX_APIKEY!
      this._baseUrl = process.env.OPEN_ROUTE_BASE_URL!
    }

    async getDistanceMatrix(origin: { lat: number; lng: number }, destinations: { lat: number; lng: number }[]): Promise<{ distances: number[]; durations: number[] }> {
        const locations = [[origin.lng, origin.lat], ...destinations.map(d => [d.lng, d.lat])];

        try {
        const response = await axios.post(this._baseUrl, {
            locations,
            metrics: ["distance", "duration"],
            units: "m"
        }, {
            headers: { Authorization: `Bearer ${this._apiKey}` }
        });

        if (response.data.error) {
            throw new ApiError(`OpenRouteService API error: ${response.data.error.message}`);
        }

        if (!response.data.distances || !response.data.durations) {
            throw new ApiError("OpenRouteService API error: No distance or duration data returned.");
        }

        const distances = response.data.distances[0].slice(1).map((d: number | null) => d != null ? d : -1);
        const durations = response.data.durations[0].slice(1).map((d: number | null) => d != null ? d : -1);

        return { distances, durations };
        } catch (error: any) {
        throw new ApiError(`Failed to fetch distance matrix data: ${error.message}`);
        }
    }
    }