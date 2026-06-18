import axios from "axios";

const API = axios.create({
    baseURL: "http://localhost:5000/api",
});

export const getSavedJobs = (token) =>
    API.get("/jobs/saved", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

export const saveJob = (id, token) =>
    API.post(
        `/jobs/${id}/save`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );