import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const mapsApi = createApi({
  reducerPath: 'mapsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://maps.googleapis.com/maps/api/',
  }),
  endpoints: (builder) => ({
    reverseGeocode: builder.query<any, { lat: number; lng: number }>({
      query: ({ lat, lng }) => 
        `geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GEOCODING_API_KEY}`,
    }),
  }),
})

export const { useReverseGeocodeQuery } = mapsApi