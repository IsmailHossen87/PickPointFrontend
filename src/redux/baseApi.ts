import { createApi } from '@reduxjs/toolkit/query/react'
import { axiosBaseQuery } from './axisBaseQuery'


// Define a service using a base URL and expected endpoints
export const baseApi = createApi({
  reducerPath: 'baseApi',
  // baseQuery: fetchBaseQuery({ baseUrl: config.baseUrl}),
  baseQuery: axiosBaseQuery(),
  tagTypes:["USER","TOUR","DIVISION","BOOKING"],
  endpoints: () =>({})
})

