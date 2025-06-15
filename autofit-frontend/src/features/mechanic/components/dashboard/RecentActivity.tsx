import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Clock, ListTodo } from "lucide-react";
import React from "react";

interface RecentActivity {
  id: string;
  name: string;
  action: string;
  time: string;
}
interface Prop {
  recentActivities: RecentActivity[] | null;
}

const RecentActivity: React.FC<Prop> = ({ recentActivities }) => {


  return (
    <>
      <div className="w-full lg:w-80 lg:order-1 mt-6 lg:mt-0">
        <div className="bg-white lg:border-r border-gray-200 lg:h-full flex flex-col">
          <div className="p-4 lg:p-6 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                <ListTodo className="w-4 h-4 text-gray-600" />
              </div>
              <h2 className="font-semibold lg:text-lg text-gray-900">
                Recent Activity
              </h2>
            </div>
          </div>
          <div className="flex-1 lg:overflow-hidden">
            <ScrollArea className="h-60 lg:h-[calc(100vh-80px)]">
              <div className="p-3 lg:p-4 space-y-2 lg:space-y-3">

                {recentActivities && recentActivities.slice(0, 5).map((activity, index) => (
                  <div
                    key={activity.id}
                    className={`p-3 lg:p-4 rounded-md lg:rounded-lg transition-colors hover:bg-gray-50 ${
                      index === 0 ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1 lg:mb-2">
                      <p className="font-medium text-gray-900 text-sm">
                        {activity.name}
                      </p>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs lg:text-sm">
                      {activity.action}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentActivity;
