import api from "../api/axiosConfig";

const getAll = () => api.get("/announcements");

const getById = (id) => api.get(`/announcements/${id}`);

const getByCourse = (courseId) =>
    api.get(`/announcements/course/${courseId}`);

const create = (courseId, announcement) =>
    api.post(`/announcements/course/${courseId}`, announcement);

const update = (id, announcement) =>
    api.put(`/announcements/${id}`, announcement);

const remove = (id) =>
    api.delete(`/announcements/${id}`);

export default {
    getAll,
    getById,
    getByCourse,
    create,
    update,
    remove,
};