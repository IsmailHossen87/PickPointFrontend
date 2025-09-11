import { baseApi } from "@/redux/baseApi";
import type { IResponse, ISendOTP, IVerifyOTP } from "@/type";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo) => ({
                url: "/auth/login",
                method: "POST",
                data: userInfo
            })
        }),
        sendotp: builder.mutation<IResponse<null>,ISendOTP>({
            query: (userInfo) => ({
                url: "/otp/send",
                method: "POST",
                data: userInfo
            })
        }),
        verifyotp: builder.mutation<IResponse<null>,IVerifyOTP>({
            query: (userInfo) => ({
                url: "/otp/verify",
                method: "POST",
                data: userInfo
            })
        }),
        register: builder.mutation({
            query: (userInfo) => ({
                url: "/user/register",
                method: "POST",
                data: userInfo
            })
        }),
        userInfo: builder.query({
            query: () => ({
                url: "/user/me",
                method: "GET",
            }),
            providesTags:["USER"]
        }),
        logOut:builder.mutation({
            query:()=>({
                url:"/auth/logout",
                method:"POST",  
            }),
             invalidatesTags: ["USER"],
        })
    })
})


export const { useLoginMutation,useSendotpMutation,useVerifyotpMutation,useRegisterMutation,useUserInfoQuery,useLogOutMutation } = authApi;