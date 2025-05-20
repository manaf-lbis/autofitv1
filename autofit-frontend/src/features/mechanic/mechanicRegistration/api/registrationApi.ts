import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";

type SuccessResponse = {
  message: string;
  data?: any;
};

type UpdateMechanicFormData = FormData & { id: string };

export const registrationApi = createApi({
  reducerPath: "registrationApi",
  baseQuery: baseQueryWithRefresh,

  endpoints: (builder) => ({

    registerMechanic: builder.mutation<SuccessResponse, FormData>({
      query: (formData) => ({
        url: "/mechanic/profile/register",
        method: "POST",
        body: formData,
      }),
    }),

    updateMechanic: builder.mutation<SuccessResponse, UpdateMechanicFormData>({
      query: ({ id, ...form }) => ({
        url: `/mechanic/update/${id}`,
        method: "PUT",
        body: form as FormData,
      }),
    }),

    getMechanic: builder.query<SuccessResponse, void>({
      query: () => ({
        url: "/mechanic/profile/me",
        method: "GET",
      }),
    })

  }),
});

export const {
  useRegisterMechanicMutation,
  useUpdateMechanicMutation,
  useGetMechanicQuery,
} = registrationApi;