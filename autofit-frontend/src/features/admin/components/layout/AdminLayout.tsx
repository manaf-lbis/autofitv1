import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/admin/components/navbar/AppSidebar";
import { Bell } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Link } from "react-router-dom";

const AdminLayout: React.FC = () => {
  const { breadcrumbs } = useSelector((state: RootState) => state.adminSlice);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((ele, index) => {
                  const isLast = index === breadcrumbs.length - 1;

                  return (
                    <React.Fragment key={index}>
                      <BreadcrumbItem
                        className={`${
                          !isLast ? "hidden md:flex" : "flex"
                        } items-center`}
                      >
                        {isLast ? (
                          <BreadcrumbPage>{ele.page}</BreadcrumbPage>
                        ) : (
                          <Link to={`/admin${ele.href}`}>{ele.page}</Link>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Admin and Notification Icon on the Right */}
          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer" />
              <span className="text-sm font-medium text-gray-700">
                Administrator
              </span>
            </div>
          </div>
        </header>

        <div className="px-5">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
