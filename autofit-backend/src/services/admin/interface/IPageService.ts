export enum DashboardRange {
  DAY = "day",
  MONTH = "month",
  YEAR = "year",
  CUSTOM = "custom"
}

export type GroupBy = 'none' | 'day' | 'month' | 'year'

export interface IPageService {
    dashboard(range: DashboardRange, from?: Date, to?: Date): Promise<any>
}