import { ILiveAssistanceRepository } from "../../repositories/interfaces/ILiveAssistanceRepository";
import { IMechanicRepository } from "../../repositories/interfaces/IMechanicRepository";
import { IPretripBookingRepository } from "../../repositories/interfaces/IPretripBookingRepository";
import { IRoadsideAssistanceRepo } from "../../repositories/interfaces/IRoadsideAssistanceRepo";
import { ITransactionRepository } from "../../repositories/interfaces/ITransactionRepository";
import { IUserRepository } from "../../repositories/interfaces/IUserRepository";
import { DashboardRange, IPageService, GroupBy } from "./interface/IPageService";
import { ServiceType } from "../../types/services";
import { addDays, addMonths, format, startOfDay, startOfMonth, isToday as dateFnsIsToday, subDays, subYears } from "date-fns" // Add imports


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


    async dashboard(range: DashboardRange, from?: Date, to?: Date): Promise<DashboardData> {
        let startDate: Date
        let endDate: Date = new Date()
        let groupBy: GroupBy

        switch (range) {
            case DashboardRange.DAY: {
                startDate = startOfDay(new Date())
                groupBy = 'none'
                break
            }
            case DashboardRange.MONTH: {
                startDate = subDays(new Date(), 30)
                groupBy = 'day'
                break
            }
            case DashboardRange.YEAR: {
                startDate = subYears(new Date(), 5)
                groupBy = 'year'
                break
            }
            case DashboardRange.CUSTOM: {
                if (!from || !to) throw new Error('From and to required for custom')
                startDate = from
                endDate = to
                const diffDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
                if (diffDays <= 1) groupBy = 'none'
                else if (diffDays <= 62) groupBy = 'day'
                else if (diffDays <= 730) groupBy = 'month'
                else groupBy = 'year'
                break
            }
            default:
                throw new Error("Invalid range")
        }

        const userCount = await this._userRepository.overallUserStatusSummary()
        const mechanicCount = await this._mechanicRepository.overallMechanicStatusSummary()
        const liveAssistanceDetails = await this._liveAssistanceRepository.liveAssistanceDetails(startDate, endDate, groupBy)
        const roadsideAssistanceDetails = await this._roadsideAssistanceRepo.roadsideAssistanceDetails(startDate, endDate, groupBy)
        const pretripBookingDetails = await this._pretripBookingRepository.pretripBookingDetails(startDate, endDate, groupBy)
        const transationDetails = await this._transationRepo.transactionDetails(startDate, endDate)
        const liveAssitance = await this._liveAssistanceRepository.findLatest(startDate, endDate)

        const users = userCount.reduce((sum: number, item: { _id: string; count: number }) => sum + item.count, 0)
        const activeUsers = userCount.find((item: { _id: string }) => item._id === "active")?.count || 0
        const mechanics = mechanicCount.reduce((sum: number, item: { _id: string; count: number }) => sum + item.count, 0)
        const activeMechanics = mechanicCount.find((item: { _id: string }) => item._id === "active")?.count || 0

        const isSingleToday = groupBy === 'none' && dateFnsIsToday(startDate)

        const isDetailsArray = Array.isArray(liveAssistanceDetails)

        const calcTotalOrders = (details: any) => isDetailsArray ? details.reduce((sum: number, item: any) => sum + item.totalOrders, 0) : details?.totalOrders || 0
        const calcTotalAmount = (details: any) => isDetailsArray ? details.reduce((sum: number, item: any) => sum + item.totalAmount, 0) : details?.totalAmount || 0

        const liveOrders = calcTotalOrders(liveAssistanceDetails)
        const roadsideOrders = calcTotalOrders(roadsideAssistanceDetails)
        const pretripOrders = calcTotalOrders(pretripBookingDetails)
        const totalBookings = liveOrders + roadsideOrders + pretripOrders

        const liveAmount = calcTotalAmount(liveAssistanceDetails)
        const roadsideAmount = calcTotalAmount(roadsideAssistanceDetails)
        const pretripAmount = calcTotalAmount(pretripBookingDetails)
        const totalAmount = liveAmount + roadsideAmount + pretripAmount
        const avgOrderValue = totalBookings > 0 ? totalAmount / totalBookings : 0

        let bookingsByService: { label: string; live: number; pretrip: number; roadside: number }[] = []

        const getOrders = (details: any, id: any) => {
            if (!isDetailsArray) return details?.totalOrders || 0
            const item = details.find((i: any) => JSON.stringify(i._id) === JSON.stringify(id))
            return item ? item.totalOrders : 0
        }

        if (groupBy === 'none') {
            const label = range === DashboardRange.DAY ? 'Today' : format(startDate, 'MMM dd, yyyy')
            bookingsByService = [{
                label,
                live: liveOrders,
                pretrip: pretripOrders,
                roadside: roadsideOrders
            }]
        } else if (groupBy === 'day') {
            let current = startOfDay(startDate)
            while (current <= endDate) {
                const d = current.getDate()
                const m = current.getMonth() + 1
                const y = current.getFullYear()
                const id = { day: d, month: m, year: y }
                const live = getOrders(liveAssistanceDetails, id)
                const pretrip = getOrders(pretripBookingDetails, id)
                const roadside = getOrders(roadsideAssistanceDetails, id)
                if (live || pretrip || roadside) {
                    bookingsByService.push({ label: `${d}`, live, pretrip, roadside })
                }
                current = addDays(current, 1)
            }
        } else if (groupBy === 'month') {
            let current = startOfMonth(startDate)
            const endM = startOfMonth(endDate)
            while (current <= endM) {
                const m = current.getMonth() + 1
                const y = current.getFullYear()
                const id = { month: m, year: y }
                const live = getOrders(liveAssistanceDetails, id)
                const pretrip = getOrders(pretripBookingDetails, id)
                const roadside = getOrders(roadsideAssistanceDetails, id)
                if (live || pretrip || roadside) {
                    bookingsByService.push({ label: format(current, 'MMM'), live, pretrip, roadside })
                }
                current = addMonths(current, 1)
            }
        } else if (groupBy === 'year') {
            let y = startDate.getFullYear()
            const endY = endDate.getFullYear()
            while (y <= endY) {
                const id = { year: y }
                const live = getOrders(liveAssistanceDetails, id)
                const pretrip = getOrders(pretripBookingDetails, id)
                const roadside = getOrders(roadsideAssistanceDetails, id)
                if (live || pretrip || roadside) {
                    bookingsByService.push({ label: `${y}`, live, pretrip, roadside })
                }
                y++
            }
        }

        const earningsByService = [
            { service: "Live Assistance", value: liveAmount },
            { service: "Pretrip Checkup", value: pretripAmount },
            { service: "Roadside Assistance", value: roadsideAmount }
        ]

        const latestBookings = liveAssitance.map((item) => {
            return {
                id: item._id.toString(),
                customer: (item.userId as any).name,
                service: ServiceType.LIVE,
                date: item.createdAt.toString(),
                amount: item.price,
                fee: 0,
                paid: item.price,
                status: item.status,
            }
        })

        const dashboardData = {
            summary: {
                users,
                activeUsers,
                mechanics,
                activeMechanics,
                todayCount: isSingleToday ? totalBookings : 0,
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