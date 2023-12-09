import axios from "axios";

if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    throw new Error("NEXT_PUBLIC_BACKEND_URL not found.");
}

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*", // Allow requests from any origin
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE", // Allow specific HTTP methods
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept", // Allow specific headers
    },
    withCredentials: false, // todo: set to true when using cookies
});

export default axiosInstance;
