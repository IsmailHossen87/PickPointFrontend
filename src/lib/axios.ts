import { config } from "@/config";
import axios from "axios"
export const axiosInstance = axios.create({
  baseURL: config.baseUrl ,
  withCredentials:true,   //FOR SET COOKIES my Local
});



// Add a request interceptor
axiosInstance.interceptors.request.use(function (config) { 
    return config;
  }, function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
