import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";

export interface ProfileData {
    name: string,
    mobile: string
    email: string
};

export interface Vehicle {
  regNo: string;
  brand: string;
  modelName: string;
  owner: string; 
}

export interface PretripRequest {
  _id: string;
  vehicle: Vehicle;
  planName: string;
  description: string;
  status: "booked" | "analysing" | "report_created" | "vehicle_returned" | "cancelled" | "completed";
  startedAt: string;
  endedAt?: string;
}
export interface ServiceHistoryResponse {
  totalDocuments: number;
  hasMore: boolean;
  history: PretripRequest[];
}
interface ServerPretripRequest {
  _id: string;
  vehicleId: { _id: string; regNo: string; brand: string; modelName: string, owner:string };
  schedule: { start: string; end?: string };
  serviceReportId: { servicePlan: { name: string; description?: string } };
  status: PretripRequest["status"];
}

export interface ServiceHistoryResponse {
  totalDocuments: number;
  hasMore: boolean;
  history: PretripRequest[];
}

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryWithRefresh,

    endpoints: (builder) => ({
        updateProfile: builder.mutation({
            query: (data: ProfileData) => ({
                url: 'user/profile/update',
                method: 'PATCH',
                body: data
            })
        }),

        serviceHistory: builder.query<{ totalDocuments: number; hasMore: boolean; history: any[] }, { page: number }>({
            query: ({ page }) => ({
                url: 'user/profile/service-history/roadside-assistance',
                method: 'GET',
                params: { page }
            }),
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (currentCache, newCache) => {
                currentCache.history.push(...newCache.history);
                currentCache.hasMore = newCache.hasMore;
                currentCache.totalDocuments = newCache.totalDocuments;
            },
            forceRefetch({ currentArg, previousArg }) {
                if (!previousArg) return false;
                const curr = currentArg?.page ?? 1;
                const prev = previousArg.page ?? 1;
                return curr > prev;
            },
            transformResponse: (response: any) => response.data
        }),



        pretripServiceHistory: builder.query<ServiceHistoryResponse, { page: number }>({
            query: ({ page }) => ({
                url: "user/profile/service-history/pretrip",
                method: "GET",
                params: { page },
            }),
            serializeQueryArgs: ({ endpointName }) => endpointName,
            merge: (currentCache, newCache) => {
                currentCache.history.push(...newCache.history);
                currentCache.hasMore = newCache.hasMore;
                currentCache.totalDocuments = newCache.totalDocuments;
            },
            forceRefetch({ currentArg, previousArg }) {
                return currentArg?.page !== previousArg?.page;
            },
            transformResponse: (response: { data: { totalDocuments: number; hasMore: boolean; history: ServerPretripRequest[] } }) => ({
                totalDocuments: response.data.totalDocuments,
                hasMore: response.data.hasMore,
                history: response.data.history.map((item) => ({
                    _id: item._id,
                    vehicle: {
                        regNo: item.vehicleId.regNo,
                        brand: item.vehicleId.brand,
                        modelName: item.vehicleId.modelName,
                        owner: item.vehicleId.owner || "Unknown Owner", // Fallback
                    },
                    planName: item.serviceReportId.servicePlan.name || "Unknown Plan",
                    description: item.serviceReportId.servicePlan.description || "No description available",
                    status: item.status,
                    startedAt: item.schedule.start,
                    endedAt: item.schedule.end,
                })),
            }),
        }),




    })

});

export const {
    useUpdateProfileMutation,
    useServiceHistoryQuery,
    usePretripServiceHistoryQuery
} = profileApi;