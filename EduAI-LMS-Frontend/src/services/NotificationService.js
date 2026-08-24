import api from "../api/axiosConfig";

// Get all notifications
const getAll = () =>
    api.get("/notifications");

// Get notification by ID
const getById = (id) =>
    api.get(`/notifications/${id}`);

// Get all notifications for user
const getByUser = (userId) =>
    api.get(`/notifications/user/${userId}`);

// Get latest 3 notifications for user
const getLatestThree = (userId) =>
    api.get(`/notifications/user/${userId}/latest`);

// Create notification
const create = (userId, notification) =>
    api.post(`/notifications/user/${userId}`, notification);

// Update notification
const update = (id, notification) =>
    api.put(`/notifications/${id}`, notification);

// Delete notification
const remove = (id) =>
    api.delete(`/notifications/${id}`);

// Mark as read
const markAsRead = (id) =>
    api.put(`/notifications/${id}/read`);

export default {
    getAll,
    getById,
    getByUser,
    getLatestThree,
    create,
    update,
    remove,
    markAsRead,
};