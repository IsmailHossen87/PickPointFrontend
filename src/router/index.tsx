import App from "@/App";
import about from "@/Pages/About";
import LoginPage from "@/Pages/Login";
import RegisterPage from "@/Pages/register";
import { createBrowserRouter } from "react-router";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { generateRoutes } from "@/utils/generateRoutes";
import { adminSilebarItems } from "./adminSidebarItems";
import { UserSidebarItems } from "./UserSidebarItems";
import { Navigate } from "react-router";   // ✅ এখানে থেকে আসল Navigate
import Unauthorized from "@/Pages/unauthorized";
import  { withAuth } from "@/utils/withAuth";
import type { IRole } from "@/type";
import { role } from "@/constant/role";
import Tour from "@/Pages/User/Tour";
import HomePage from "@/Pages/HomePage";
import TourDetails from "@/Pages/TourDetails";
import Booking from "@/Pages/User/Booking";
import Verifie from "@/Pages/Verify";
import Success from "@/Pages/payment/success";
import fail from "@/Pages/payment/fail";
import cancel from "@/Pages/payment/cancel";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        Component: HomePage,
        index: true,
      },
      {
        path: "about",
        Component: about,
      },
      {
        path: "tours",
        Component: Tour,
      },
      {
        path: "tours/:id",
        Component: TourDetails,
      },
      {
        path: "booking/:id",
        Component: withAuth(Booking),
      },
    ],
  },
  // AdminDashboard
  {
    path: "/admin",
    Component: withAuth(DashboardLayout ,role.superAdmin as IRole),  //wrap 
    children: [
      { index: true, element: <Navigate to="/admin/analytics" /> }, // ✅ Redirect
      ...generateRoutes(adminSilebarItems),
    ],
  },
  // User
  {
    path: "/user",
    Component: DashboardLayout,
    children: [
         { index: true, element: <Navigate to="/user/bookings" /> }, // ✅ Redirect
        ...generateRoutes(UserSidebarItems)],
  },
  // Public
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/verify",
    Component:Verifie
  },
  {
    path: "/unauthorized",
    Component: Unauthorized,
  },
  {
    path: "/payment/success",
    Component: Success,
  },
  {
  path: "/payment/fail",
    Component: fail,
  },
  {
   path: "/payment/cancel",
    Component: cancel,
  },
]);
