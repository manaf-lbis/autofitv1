import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithRefresh } from "@/utils/baseQuery";



export const servicesApi = createApi({
    reducerPath: "servicesApi",
    baseQuery: baseQueryWithRefresh,
    tagTypes: ['Services'],

    endpoints: (builder) => ({

        getNearByMechanic: builder.query<any, { lat: number; lng: number }>({
            query: ({ lat, lng }) => ({
                url: 'user/services/mechanics-nearby',
                method: 'GET',
                params: { lat, lng }
            })
        }),

        bookEmergencyAssistance: builder.mutation<any, { mechanicId: string, vehicleId: string, issue: string, description: string, coordinates: { lat: number, lng: number } }>({
            query: ({ mechanicId, vehicleId, issue, description, coordinates }) => ({
                url: 'user/services/roadside-assistance',
                method: 'POST',
                body: { mechanicId, vehicleId, issue, description, coordinates }


            })
        }),

        roadsideDetails: builder.query({
            query: (id: string) => ({
                url: `user/services/roadside-assistance/${id}/details`,
                method: 'GET'
            }),
            providesTags: ['Services'],
        }),

        approveQuoteAndPay: builder.mutation<any, { serviceId: string, quotationId: string }>({
            query: (data) => ({
                url: `user/services/roadside-assistance/payment`,
                method: 'POST',
                body: data
            })
        }),

        verifyPayment: builder.mutation<any, { orderId: string; paymentId: string; signature: string; }>({
            query: (data) => ({
                url: `user/services/roadside-assistance/verify-payment`,
                method: 'POST',
                body: data
            })
        }),

        cancelBooking: builder.mutation<any, { serviceId: string }>({
            query: ({ serviceId }) => ({
                url: `user/services/roadside-assistance/cancel`,
                method: 'POST',
                body: { serviceId },
            }),
            invalidatesTags: ['Services'],
        }),

        rejectQuotation: builder.mutation<any, { serviceId: string }>({
            query: (data) => ({
                url: `user/services/roadside-assistance/quotation/reject`,
                method: 'POST',
                body: data
            }),
            invalidatesTags: ['Services'],
        }),

        generateInvoice: builder.mutation<void, { serviceId: string }>({
            query: ({ serviceId }) => ({
                url: `user/services/roadside-assistance/invoice`,
                method: "POST",
                body: { serviceId },
                responseType: "blob", 
            }),
            transformResponse: (response: Blob, meta, arg) => {
                const url = window.URL.createObjectURL(response);
                const link = document.createElement("a");
                link.href = url;
                link.download = `invoice-${arg.serviceId}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            },
        }),

    }),

});

export const {
    useGetNearByMechanicQuery,
    useBookEmergencyAssistanceMutation,
    useRoadsideDetailsQuery,
    useApproveQuoteAndPayMutation,
    useCancelBookingMutation,
    useRejectQuotationMutation,
    useVerifyPaymentMutation,
    useGenerateInvoiceMutation
} = servicesApi;