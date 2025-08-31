import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";
import { LiveAssistanceStatus } from "@/types/liveAssistance"; 

export interface ProfileData {
    name: string;
    mobile: string;
    email: string;
}

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

export interface Mechanic {
    name: string;
    email: string;
}

export interface Payment {
    amount: number;
    status: string;
    paymentId: string;
    receipt: string;
}

export interface LiveAssistanceRequest {
    _id: string;
    mechanic: Mechanic;
    issue: string;
    description: string;
    status: LiveAssistanceStatus;
    price: number;
    startedAt: string;
    endedAt?: string;
    payment: Payment;
}

export interface ServiceHistoryResponse<T = PretripRequest | LiveAssistanceRequest> {
    totalDocuments: number;
    hasMore: boolean;
    history: T[];
}

interface ServerPretripRequest {
    _id: string;
    vehicleId: { _id: string; regNo: string; brand: string; modelName: string; owner: string };
    schedule: { start: string; end?: string };
    serviceReportId: { servicePlan: { name: string; description?: string } };
    status: PretripRequest["status"];
}

interface ServerLiveAssistanceRequest {
    _id: string;
    mechanicId: { _id: string; name: string; email: string };
    issue: string;
    description: string;
    status: LiveAssistanceStatus;
    price: number;
    startTime: string;
    endTime?: string;
    paymentId: { _id: string; amount: number; status: string; paymentId: string; receipt: string };
}

export const profileApi = createApi({
    reducerPath: "profileApi",
    baseQuery: baseQueryWithRefresh,
    endpoints: (builder) => ({
        updateProfile: builder.mutation({
            query: (data: ProfileData) => ({
                url: "user/profile/update",
                method: "PATCH",
                body: data,
            }),
        }),

        serviceHistory: builder.query<ServiceHistoryResponse, { page: number }>({
            query: ({ page }) => ({
                url: "user/profile/service-history/roadside-assistance",
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
            transformResponse: (response: any) => response.data,
        }),

        pretripServiceHistory: builder.query<ServiceHistoryResponse<PretripRequest>, { page: number }>({
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
                        owner: item.vehicleId.owner || "Unknown Owner",
                    },
                    planName: item.serviceReportId.servicePlan.name || "Unknown Plan",
                    description: item.serviceReportId.servicePlan.description || "No description available",
                    status: item.status,
                    startedAt: item.schedule.start,
                    endedAt: item.schedule.end,
                })),
            }),
        }),

        liveAssistServiceHistory: builder.query<ServiceHistoryResponse<LiveAssistanceRequest>, { page: number }>({
            query: ({ page }) => ({
                url: "user/profile/service-history/live-assistance",
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
            transformResponse: (response: { data: { totalDocuments: number; hasMore: boolean; history: ServerLiveAssistanceRequest[] } }) => ({
                totalDocuments: response.data.totalDocuments,
                hasMore: response.data.hasMore,
                history: response.data.history.map((item) => ({
                    _id: item._id,
                    mechanic: {
                        name: item.mechanicId.name,
                        email: item.mechanicId.email,
                    },
                    issue: item.issue,
                    description: item.description,
                    status: item.status as LiveAssistanceStatus,
                    price: item.price,
                    startedAt: item.startTime,
                    endedAt: item.endTime,
                    payment: {
                        amount: item.paymentId.amount,
                        status: item.paymentId.status,
                        paymentId: item.paymentId.paymentId,
                        receipt: item.paymentId.receipt,
                    },
                })),
            }),
        }),
    }),
});

export const {
    useUpdateProfileMutation,
    useServiceHistoryQuery,
    usePretripServiceHistoryQuery,
    useLiveAssistServiceHistoryQuery,
} = profileApi;