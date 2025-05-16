"use client"
import * as React from "react"
import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import af_logo from '@/assets/common/af_logo_b_text.png'

import data from "../utils"
import { useSelector} from "react-redux"
import { RootState } from "@/store/store"


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
   const {user} =  useSelector((state:RootState)=> state.auth)

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square w-[4rem] items-center justify-center rounded-lg text-sidebar-primary-foreground">
                  <img src={af_logo} alt="" />
                </div>
                
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">AutoFit</span>
                  <span className="truncate text-xs">Admin Pannel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain title={'Management'} items={data.navMain} />
        <NavMain title={'Utility'} items={data.navSecondary} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser  user={
            user
            ? { name: user.name, email: user.email, avatar: "" }
            : { name: "", email: "", avatar: "" }
        } />
      </SidebarFooter>
    </Sidebar>
  )
}
