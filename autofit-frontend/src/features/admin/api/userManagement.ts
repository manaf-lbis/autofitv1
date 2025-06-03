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

export const userManagementApi = createApi({
    reducerPath: "userManagementApi",
    baseQuery: baseQueryWithRefresh,
    endpoints: (builder) => ({
        getAllUsers: builder.query<
            Response,
            { page: number; limit: number; search?: string; sortField?: string; sortOrder?: 'asc' | 'desc' }>({
                query: ({ page, limit, search, sortField, sortOrder }) => ({
                    url: "admin/users",
                    method: "GET",
                    params: { page, limit, search, sortField, sortOrder },
                }),
            }),

        getUserDetails: builder.query<any, string>({
            query: (id) => `admin/users/${id}`,
        }),

        updateUserStatus: builder.mutation<any, { id: string; status: 'active' | 'blocked' }>({
            query: ({ id, status }) => ({
                url: `admin/users/${id}/status`,
                method: "PATCH",
                body: { status },
            }),
        }),

    }),
});

export const {
    useGetAllUsersQuery,
    useGetUserDetailsQuery,
    useUpdateUserStatusMutation
} = userManagementApi;