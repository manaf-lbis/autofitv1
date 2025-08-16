import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithRefresh } from '@/utils/baseQuery';
import { PaymentGateway, ServiceType } from '@/types/user';


export const paymentApi = createApi({
  reducerPath: 'paymentApi',
  baseQuery: baseQueryWithRefresh,
  tagTypes: [],

  endpoints: (builder) => ({

    getCheckout : builder.query<any,{serviceType:ServiceType;serviceId:string}>({
        query:({serviceType,serviceId})=>({
          url: `user/checkout/${serviceType}/details/${serviceId}`,
          method: 'GET'
        }),
        transformErrorResponse : (res)=>res.data
    }),

    createPayment : builder.mutation<any,{serviceType:ServiceType; serviceId:string;gateway:PaymentGateway}>({
        query:({serviceType,serviceId,gateway})=>({
          url: `user/checkout/${serviceType}/payment/${serviceId}`,
          method: 'POST',
          body:{gateway}
        }),
        transformErrorResponse : (res)=>res.data
    }),

    verifyPayment : builder.mutation<any,{serviceType:ServiceType;serviceId:string;orderId?:string;status?:'success'|'failed',data?:any,gateway:string}>({
        query:({serviceType,serviceId,status,data,orderId,gateway})=>({
          url: `user/checkout/${serviceType}/verify-payment/${serviceId}`,
          method: 'POST',
          body:{status,...data,gateway,orderId}
        }),
        transformErrorResponse : (res)=>res.data
    }),

  }),

});

export const {
  useGetCheckoutQuery,
  useCreatePaymentMutation,
  useVerifyPaymentMutation
} = paymentApi;