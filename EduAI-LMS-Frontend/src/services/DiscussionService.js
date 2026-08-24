import api from "../api/axiosConfig";

// =====================================================
// GET ALL DISCUSSIONS
// =====================================================

const getAll = () => {

    return api.get("/discussions");
};


// =====================================================
// GET DISCUSSION BY ID
// =====================================================

const getById = (id) => {

    return api.get(
        `/discussions/${id}`
    );
};


// =====================================================
// GET DISCUSSIONS BY COURSE
// =====================================================

const getByCourse = (courseId) => {

    return api.get(
        `/discussions/course/${courseId}`
    );
};


// =====================================================
// GET DISCUSSIONS BY USER
// =====================================================

const getByUser = (userId) => {

    return api.get(
        `/discussions/user/${userId}`
    );
};


// =====================================================
// CREATE CHAT MESSAGE
// =====================================================

const create = (
    courseId,
    userId,
    discussion
) => {

    return api.post(

        `/discussions/course/${courseId}/user/${userId}`,

        discussion
    );
};


// =====================================================
// UPDATE MESSAGE
// =====================================================

const update = (
    id,
    discussion
) => {

    return api.put(

        `/discussions/${id}`,

        discussion
    );
};


// =====================================================
// DELETE MESSAGE
// =====================================================

const remove = (id) => {

    return api.delete(
        `/discussions/${id}`
    );
};


// =====================================================
// GET CHAT STATUS
// =====================================================

const getChatStatus = (
    courseId
) => {

    return api.get(
        `/discussions/course/${courseId}/chat-status`
    );
};


// =====================================================
// ENABLE / DISABLE CHAT
// =====================================================

const setChatStatus = (
    courseId,
    enabled
) => {

    return api.put(

        `/discussions/course/${courseId}/chat-status?enabled=${enabled}`
    );
};


// =====================================================
// EXPORT
// =====================================================

const DiscussionService = {

    getAll,

    getById,

    getByCourse,

    getByUser,

    create,

    update,

    remove,

    getChatStatus,

    setChatStatus
};

export default DiscussionService;