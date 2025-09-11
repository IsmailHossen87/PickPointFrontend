import * as React from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import Logo from "@/assets/icons/Logo"
import { Link } from "react-router"
import { sideBarItem } from "@/utils/getSidebarItems"
import { useUserInfoQuery } from "@/redux/feature/auth/authApi"




export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {  
  const {data : userData} = useUserInfoQuery(undefined)
  console.log(userData)
  const data = { 
  // router -> adminSidebar থেকে
  // navMain: UserSidebarItems / adminSidebarItems
  navMain :sideBarItem(userData?.data?.role)        //getSidebar Item
}
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        {/* repleace */}
        <Link to={"/"}>
        <Logo/></Link>
      </SidebarHeader>
      <SidebarContent>
        {/* We create a SidebarGroup for each parent. */}
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild >
                      <Link to={item.url}>{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
