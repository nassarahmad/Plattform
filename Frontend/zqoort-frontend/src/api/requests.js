import API from "./axios";

export const createRequest = (data) => API.post("/requests", data);
export const getRequests = () => API.get("/requests");