import { baseApi } from "@/redux/baseApi";

export const divisionApi = baseApi.injectEndpoints({
    endpoints:(builder)=>({
        addDivision:builder.mutation({
            query:(divisionData)=>({
                url:"/division/create",
                method:"POST",
                data:divisionData
            }),
            invalidatesTags:["DIVISION"]
        }),
        divisionData:builder.query({
            query:(params)=>({
                url:"/division",
                method:"GET",
                params
            }),
            providesTags:["DIVISION"]
        }),
        
    })
})


export const {useAddDivisionMutation,useDivisionDataQuery} = divisionApi