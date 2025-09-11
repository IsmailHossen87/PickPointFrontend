import AddDivision from "@/Pages/Admin/AddDivision";
import { AddTour } from "@/Pages/Admin/AddTour";
import AddTourType from "@/Pages/Admin/AddTourType";
import { lazy } from "react";

const Analytics = lazy(()=>import ("@/Pages/Admin/Analytics"))  //ai page e aslei tobe eta render hobe
export const adminSilebarItems = [
    {
      title: "Dashboard",
      url: "#",
      items: [
        {
          title: "Analytics",
          url: "/admin/analytics",
          component:Analytics 
        },
      ],
    },
    {
      title: "Tour Management",
      url: "#",
      items: [
        {
          title: "Add Tour Type",
          url: "/admin/add-tour-type",
          component:AddTourType 
         },
        {
          title: "Add Division",
          url: "/admin/add-division",
          component:AddDivision 
         },
        {
          title: "Add Tour",
          url: "/admin/add-tour",
          component:AddTour
         },
      ],
    }
  ]