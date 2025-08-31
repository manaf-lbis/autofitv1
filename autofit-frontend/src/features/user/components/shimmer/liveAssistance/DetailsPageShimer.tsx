import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const DetailsPageShimer = () => {
  return (
    <div className="min-h-screen max-w-7xl mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gray-200 rounded-md animate-pulse" />
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse" />
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          <div className="xl:col-span-3 space-y-6">
            <Card className="border-border shadow-sm rounded-md">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-200 rounded-md h-10 w-10 animate-pulse" />
                    <div>
                      <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-20 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-6 w-16 bg-gray-200 rounded-md animate-pulse" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-11 w-48 bg-gray-200 rounded-md animate-pulse" />
              </CardContent>
            </Card>
            <Card className="border-border shadow-sm rounded-md">
              <CardHeader>
                <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-border">
                  <div className="text-center p-3 bg-gray-100 rounded-md">
                    <div className="h-6 w-16 mx-auto bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 mx-auto bg-gray-200 rounded animate-pulse mt-2" />
                  </div>
                  <div className="text-center p-3 bg-gray-100 rounded-md">
                    <div className="h-6 w-16 mx-auto bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 mx-auto bg-gray-200 rounded animate-pulse mt-2" />
                  </div>
                  <div className="text-center p-3 bg-gray-100 rounded-md">
                    <div className="h-6 w-16 mx-auto bg-gray-200 rounded animate-pulse" />
                    <div className="h-4 w-24 mx-auto bg-gray-200 rounded animate-pulse mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-border shadow-sm rounded-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-border shadow-sm rounded-md">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="xl:col-span-1">
            <Card className="border-border shadow-sm xl:sticky xl:top-24 rounded-md">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 bg-gray-200 rounded-md animate-pulse" />
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse" />
                </div>
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-3 bg-gray-100 rounded-md">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-100 rounded-md">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="p-3 bg-gray-100 rounded-md">
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                      <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-md">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-1" />
                    <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};