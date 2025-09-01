export enum DashboardRange {
  DAY = "day" , MONTH = "month" , YEAR = "year"
} 



export interface IPageService {
    dashboard(range:DashboardRange): Promise<any>
}
