import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithRefresh } from "@/utils/baseQuery"

export interface DashboardData {
  summary: {
    users: number
    activeUsers: number
    mechanics: number
    activeMechanics: number
    todayCount: number
    totalBookings: number
    avgOrderValue: number
  }
  series: {
    bookingsByService: { label: string; live: number; pretrip: number; roadside: number }[]
    earningsByService: { service: string; value: number }[]
    net: { revenue: number; paid: number; deductions: number; net: number }
  }
  latestBookings: {
    id: string
    customer: string
    service: string
    date: string
    amount: number
    fee: number
    paid: number
    status: string
  }[]
}

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithRefresh,
  endpoints: (builder) => ({
    adminDashboard: builder.query<DashboardData, { range: string }>({
      query: ({ range }) => ({
        url: "admin/pages/dashboard",
        method: "GET",
        params: { range }
      }),
      transformResponse: (response: { data: DashboardData }) => response.data,
    }),
  }),
})

export const { useAdminDashboardQuery } = adminApi