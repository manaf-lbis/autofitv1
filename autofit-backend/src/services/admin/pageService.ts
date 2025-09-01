import { ILiveAssistanceRepository } from "../../repositories/interfaces/ILiveAssistanceRepository";
import { IMechanicRepository } from "../../repositories/interfaces/IMechanicRepository";
import { IPretripBookingRepository } from "../../repositories/interfaces/IPretripBookingRepository";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { ITransactionRepository } from "../../repositories/interfaces/ITransactionRepository";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { DashboardRange, IPageService } from "./interface/IPageService";
import { ServiceType } from "../../types/services";

interface MonthData {
    _id: { day: number; month: number; year: number }
    totalOrders: number
    totalAmount: number
}

interface YearData {
    _id: { year: number }
    totalOrders: number
    totalAmount: number
}

interface DashboardData {
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
        customer: string,
        service: string
        date: string
        amount: number
        status: string
    }[]
}

export class PageService implements IPageService {

    constructor(
        private _mechanicRepository: IMechanicRepository,
        private _userRepository: IUserRepository,
        private _liveAssistanceRepository: ILiveAssistanceRepository,
        private _roadsideAssistanceRepo: IRoadsideAssistanceRepo,
        private _pretripBookingRepository: IPretripBookingRepository,
        private _transationRepo: ITransactionRepository

    ) { }


    async dashboard(range: DashboardRange): Promise<DashboardData> {

        const userCount = await this._userRepository.overallUserStatusSummary()
        const mechanicCount = await this._mechanicRepository.overallMechanicStatusSummary()
        const liveAssistanceDetails = await this._liveAssistanceRepository.liveAssistanceDetailsByRange(range)
        const roadsideAssistanceDetails = await this._roadsideAssistanceRepo.roadsideAssistanceDetailsByRange(range)
        const pretripBookingDetails = await this._pretripBookingRepository.pretripBookingDetailsByRange(range)
        const transationDetails = await this._transationRepo.transactionDetailsByRange(range)
        const liveAssitance = await this._liveAssistanceRepository.findLatest()


        const users = userCount.reduce((sum: number, item: { _id: string; count: number }) => sum + item.count, 0)
        const activeUsers = userCount.find((item: { _id: string }) => item._id === "active")?.count || 0
        const mechanics = mechanicCount.reduce((sum: number, item: { _id: string; count: number }) => sum + item.count, 0)
        const activeMechanics = mechanicCount.find((item: { _id: string }) => item._id === "active")?.count || 0

        const totalBookings = (range === "day" ? (liveAssistanceDetails.totalOrders || 0)
            + (roadsideAssistanceDetails.totalOrders || 0)
            + (pretripBookingDetails.totalOrders || 0)
            : liveAssistanceDetails.reduce((sum: number, item: MonthData | YearData) => sum + item.totalOrders, 0) +
            roadsideAssistanceDetails.reduce((sum: number, item: MonthData | YearData) => sum + item.totalOrders, 0) +
            pretripBookingDetails.reduce((sum: number, item: MonthData | YearData) => sum + item.totalOrders, 0))


        const totalAmount = (range === "day" ? (liveAssistanceDetails.totalAmount || 0)
            + (roadsideAssistanceDetails.totalAmount || 0)
            + (pretripBookingDetails.totalAmount || 0)
            : liveAssistanceDetails.reduce((sum: number, item: MonthData | YearData) => sum + item.totalAmount, 0) +
            roadsideAssistanceDetails.reduce((sum: number, item: MonthData | YearData) => sum + item.totalAmount, 0) +
            pretripBookingDetails.reduce((sum: number, item: MonthData | YearData) => sum + item.totalAmount, 0))
        const avgOrderValue = totalBookings > 0 ? totalAmount / totalBookings : 0


        let bookingsByService: { label: string; live: number; pretrip: number; roadside: number }[] = []

        if (range === "day") {
            const live = liveAssistanceDetails.totalOrders || 0
            const pretrip = pretripBookingDetails.totalOrders || 0
            const roadside = roadsideAssistanceDetails.totalOrders || 0
            bookingsByService = [{ label: "Today", live, pretrip, roadside }]

        } else if (range === "month") {
            const daysInMonth = new Date(2025, 8, 0).getDate()
            bookingsByService = Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                const live = liveAssistanceDetails.find((item: MonthData) => item._id.day === day)?.totalOrders || 0
                const pretrip = pretripBookingDetails.find((item: MonthData) => item._id.day === day)?.totalOrders || 0
                const roadside = roadsideAssistanceDetails.find((item: MonthData) => item._id.day === day)?.totalOrders || 0
                return { label: `${day}`, live, pretrip, roadside }
            }).filter(item => item.live > 0 || item.pretrip > 0 || item.roadside > 0)

        } else if (range === "year") {
            const currentYear = 2025
            const years = Array.from({ length: 5 }, (_, i) => currentYear - i)
            bookingsByService = years.map((year) => {
                const live = liveAssistanceDetails.reduce((sum: number, item: YearData) =>
                    item._id.year === year ? sum + item.totalOrders : sum, 0)
                const pretrip = pretripBookingDetails.reduce((sum: number, item: YearData) =>
                    item._id.year === year ? sum + item.totalOrders : sum, 0)
                const roadside = roadsideAssistanceDetails.reduce((sum: number, item: YearData) =>
                    item._id.year === year ? sum + item.totalOrders : sum, 0)
                return { label: `${year}`, live, pretrip, roadside }
            }).filter(item => item.live > 0 || item.pretrip > 0 || item.roadside > 0)
        }

        const earningsByService = [
            { service: "Live Assistance", value: range === "day" ? liveAssistanceDetails.totalAmount || 0 : liveAssistanceDetails.reduce((sum: number, item: MonthData | YearData) => sum + item.totalAmount, 0) },
            { service: "Pretrip Checkup", value: range === "day" ? pretripBookingDetails.totalAmount || 0 : pretripBookingDetails.reduce((sum: number, item: MonthData | YearData) => sum + item.totalAmount, 0) },
            { service: "Roadside Assistance", value: range === "day" ? roadsideAssistanceDetails.totalAmount || 0 : roadsideAssistanceDetails.reduce((sum: number, item: MonthData | YearData) => sum + item.totalAmount, 0) }
        ]

        const latestBookings = liveAssitance.map((item) => {
            return {
                id: item._id.toString(),
                customer: (item.userId as any).name,
                amount: item.price,
                date: item.createdAt.toString(),
                status: item.status,
                service: ServiceType.LIVE
            }
        })

        const dashboardData = {
            summary: {
                users,
                activeUsers,
                mechanics,
                activeMechanics,
                todayCount: range === "day" ? totalBookings : 0,
                totalBookings,
                avgOrderValue
            },
            series: {
                bookingsByService,
                earningsByService,
                net: transationDetails
            },
            latestBookings
        }

        return dashboardData

    }




}