import api from "../api/axiosConfig";

// Get all replies
const getAll = () => {
    return api.get("/discussion-replies");
};

// Get reply by ID
const getById = (id) => {
    return api.get(`/discussion-replies/${id}`);
};

// Get replies by discussion
const getByDiscussion = (discussionId) => {
    return api.get(`/discussion-replies/post/${discussionId}`);
};

// Create reply
const create = (discussionId, userId, reply) => {
    return api.post(
        `/discussion-replies/post/${discussionId}/user/${userId}`,
        reply
    );
};

// Update reply
const update = (id, reply) => {
    return api.put(`/discussion-replies/${id}`, reply);
};

// Delete reply
const remove = (id) => {
    return api.delete(`/discussion-replies/${id}`);
};

export default {
    getAll,
    getById,
    getByDiscussion,
    create,
    update,
    remove,
};