import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardShimmer() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-blue-100/60 dark:border-blue-900/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-7 border-blue-100/60 dark:border-blue-900/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          </CardContent>
        </Card>

        <Card className="xl:col-span-5 border-blue-100/60 dark:border-blue-900/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          </CardContent>
        </Card>

        <Card className="xl:col-span-7 border-blue-100/60 dark:border-blue-900/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
            <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          </CardContent>
        </Card>

        <Card className="xl:col-span-5 border-blue-100/60 dark:border-blue-900/40">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 rounded" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i} className="border-blue-100/60 dark:border-blue-900/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
              <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
              <div className="h-4 w-48 bg-gray-200 dark:bg-gray-700 rounded mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}