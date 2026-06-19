import api from "./api";

export const getApplications = () =>
    api.get("/applications");

export const createApplication = (data) =>
    api.post("/applications", data);

export const updateApplicationStatus = (id, status) =>
    api.patch(`/applications/${id}/status`, { status });

export const deleteApplication = (id) =>
    api.delete(`/applications/${id}`);
