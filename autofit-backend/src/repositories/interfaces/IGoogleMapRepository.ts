export interface IGoogleMapRepository {
    
  getDistanceMatrix(  origin: { lat: number; lng: number },  destinations: { lat: number; lng: number }[] ): Promise<{
    distances: number[];
    durations: number[];
  }>;
}