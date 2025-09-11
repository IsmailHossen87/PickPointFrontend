import { baseApi } from "@/redux/baseApi";
import type { IResponse, ITourPackage } from "@/type";

export const tourApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addTourType: builder.mutation({
            query: (tourTypeName) => ({
                url: "/tour/create-tour-type",
                method: "POST",
                data: tourTypeName
            }),
            invalidatesTags: ["TOUR"]
        }),
        // add Tour
        addTour: builder.mutation({
            query: (tourData) => ({
                url: "/tour/create",
                method: "POST",
                data: tourData
            }),
            invalidatesTags: ["TOUR"]
        }),
        getTourType: builder.query({
            query: () => ({
                url: "/tour/tour-types",
                method: "GET"
            }),
            providesTags: ["TOUR"],
            transformResponse: (res) => res.data,
        }),
        getAllTour: builder.query<ITourPackage[], unknown>({
            query: (params) => ({
                url: "/tour",
                method: "GET",
                params
            }),
            providesTags: ["TOUR"],
               transformResponse: (response: IResponse<ITourPackage[]>) => response.data,
        }),
        deleteTourType: builder.mutation({
            query: (tourTypeId) => ({
                url: `/tour/tour-types/${tourTypeId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["TOUR"]
        }),
    })
})


export const { useAddTourTypeMutation, useAddTourMutation, useGetTourTypeQuery, useGetAllTourQuery, useDeleteTourTypeMutation } = tourApi