import { useUserInfoQuery } from "@/redux/feature/auth/authApi"
import type { IRole } from "@/type"
import { Navigate } from "react-router" 
import React from "react"

export const withAuth = (Component: React.ComponentType, requiredRole?: IRole) => {
  return function AuthWrapper() { 
    const { data, isLoading } = useUserInfoQuery(undefined) 
    console.log("UserInfo",data)

    if (!data?.data?.email && !isLoading) {
      return <Navigate to="/login" />
    }

    if (requiredRole && !isLoading && requiredRole !== data?.data?.role) {
      return <Navigate to="/unauthorized" />
    }

    return <Component />
  }
}
