import Booking from "@/Pages/User/Booking";

export const UserSidebarItems = [
    {
      title: "History",
      url: "#",
      items: [
        {
          title: "Bookings",
          url: "/user/bookings",
          component:Booking   //extra add
        },
      ],
    }
  ]
