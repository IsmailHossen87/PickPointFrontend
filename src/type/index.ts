import type { ComponentType } from "react"

export interface ISendOTP {
    email:string
}
export interface IVerifyOTP{
    email:string,
    otp:string
}
export interface IResponse<T> {
    statusCode:number,
    success:boolean,
    message:string,
    data:T
}


export interface ISisebarItem {
    title:string,
    items:{
        title:string,
        url:string,
        component:ComponentType
    }[]
}


export type IRole ="SUPER_ADMIN" | "ADMIN" | "USER" 


export interface ITourPackage {
  _id: string;
  title: string;
  slug: string;
  startDate: string;
  endDate: string;
  arrivalLocation: string;
  departureLocation: string;
  location: string;
  description: string;
  costFrom: number;
  maxGuest: number;
  minAge: number;
  division: string;
  tourType: string;
  amenities: string[];
  included: string[];
  excluded: string[];
  tourPlan: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}
