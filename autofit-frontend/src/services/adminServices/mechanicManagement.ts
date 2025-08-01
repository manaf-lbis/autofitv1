import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";


interface UserDetails {
    _id: string;
    name: string;
    mobile: string;
    email: string;
    status: 'active' | 'blocked';
}

interface Response {
    status: string;
    message: string;
    data: {
        users: UserDetails[];
        total: number;
        page: number;
        totalPages: number;
    };
}

interface PaginationParams {
    page: number;
    limit: number;
    search?: string;
    sortField?: string;
    sortOrder?: 'asc' | 'desc';
}

export const mechananicManagementApi = createApi({
    reducerPath: "mechananicManagementApi",
    baseQuery: baseQueryWithRefresh,
    endpoints: (builder) => ({

        getAllMechanic: builder.query<
            Response,
            { page: number; limit: number; search?: string; sortField?: string; sortOrder?: 'asc' | 'desc' }>({
                query: ({ page, limit, search, sortField, sortOrder }) => ({
                    url: "admin/mechanic",
                    method: "GET",
                    params: { page, limit, search, sortField, sortOrder },
                }),
            }),

        getMechanicDetails: builder.query<any, string>({
            query: (id) => `admin/mechanic/${id}`,
        }),

        updateMechanicStatus: builder.mutation<any, { id: string; status: 'active' | 'blocked' }>({
            query: ({ id, status }) => ({
                url: `admin/mechanic/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
        }),

        getMechanicApplications: builder.query<any, PaginationParams>({
            query: ({ page, limit, search, sortField, sortOrder }) => ({
                url: 'admin/mechanic/applications',
                methord: 'GET',
                params: { page, limit, search, sortField, sortOrder },
            }),
        }),

        applicationStatus: builder.mutation<any, { id: string; status: 'approved' | 'rejected', rejectionReason?: string  }>({
            query: ({ id, status, rejectionReason }) => ({
                url: `admin/mechanic/application/${id}/status`,
                method: "PATCH",
                body: { status ,rejectionReason },
            }),
        })

    }),
});

export const {
    useGetAllMechanicQuery,
    useGetMechanicDetailsQuery,
    useUpdateMechanicStatusMutation,
    useGetMechanicApplicationsQuery,
    useApplicationStatusMutation,

} = mechananicManagementApi;