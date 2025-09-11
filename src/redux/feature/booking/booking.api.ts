import { baseApi } from "@/redux/baseApi";

export const bookingApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createBooking: builder.mutation({
            query: (booking) => ({
                url: "/booking",
                method: "POST",
                data: booking
            }),
            invalidatesTags: ["BOOKING"]
        }),
        getBooking:builder.query({
            query:()=>({
                url:"/book",
                method:"GET"
            }),
            providesTags:["BOOKING"],
            transformResponse:(response)=>response.data
        })

    })
})


export const { useCreateBookingMutation,useGetBookingQuery} = bookingApi