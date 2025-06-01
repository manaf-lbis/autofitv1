import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";

type FormData = {
  regNo: string;
  brand: string;
  modelName: string;
  fuelType: string;
  owner: string;
};

type UpdateVehicleData = FormData & { id: string };

export const vehicleApi = createApi({
  reducerPath: "vehicleApi",
  baseQuery: baseQueryWithRefresh,
  
  endpoints: (builder) => ({
    newVehicle: builder.mutation({
      query: (data: FormData) => ({
        url: "user/vehicle/new-vehicle",
        method: "POST",
        body: data,
      }),
    }),
    getMyVehicles: builder.query({
      query: () => ({
        url: "user/vehicle/my-vehicles",
        method: "GET",
      }),
    }),
    updateVehicle: builder.mutation({
      query: (data: UpdateVehicleData) => ({
        url: `user/vehicle/my-vehicle`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteVehicle: builder.mutation({
      query: (id: string) => ({
        url: `user/vehicle/my-vehicle?id=${id}`,
        method: "DELETE",
      }),
    }),
    getVehicleBrand: builder.query({
      query: () => ({
        url: "user/vehicle/vehicle-brands",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useNewVehicleMutation,
  useGetMyVehiclesQuery,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useGetVehicleBrandQuery,
} = vehicleApi;