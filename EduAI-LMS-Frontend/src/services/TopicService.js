import api from "../api/axiosConfig";

// =====================================================
// GET ALL TOPICS
// =====================================================
// ADMIN USE
// =====================================================

const getAllTopics = () => {
    return api.get("/topics");
};


// =====================================================
// GET TOPICS FOR STUDENT
// =====================================================
// STUDENT USE
//
// Only topics belonging to the student's enrolled
// courses are returned.
//
// Example:
// /api/topics/student/3
// =====================================================

const getStudentTopics = (studentId) => {
    return api.get(
        `/topics/student/${studentId}`
    );
};


// =====================================================
// GET TOPIC BY ID
// =====================================================

const getTopicById = (id) => {
    return api.get(
        `/topics/${id}`
    );
};


// =====================================================
// GET TOPICS BY SUBJECT
// =====================================================

const getTopicsBySubject = (subjectId) => {
    return api.get(
        `/topics/subject/${subjectId}`
    );
};


// =====================================================
// GET TOPICS BY SUBJECT FOR STUDENT
// =====================================================

const getTopicsBySubjectForStudent = (
    studentId,
    subjectId
) => {

    return api.get(
        `/topics/student/${studentId}/subject/${subjectId}`
    );
};


// =====================================================
// CREATE TOPIC
// =====================================================
// ADMIN USE
// =====================================================

const createTopic = (
    subjectId,
    topic
) => {

    return api.post(
        `/topics/${subjectId}`,
        topic
    );
};


// =====================================================
// UPDATE TOPIC
// =====================================================
// ADMIN USE
// =====================================================

const updateTopic = (
    id,
    subjectId,
    topic
) => {

    return api.put(
        `/topics/${id}/${subjectId}`,
        topic
    );
};


// =====================================================
// DELETE TOPIC
// =====================================================
// ADMIN USE
// =====================================================

const deleteTopic = (id) => {

    return api.delete(
        `/topics/${id}`
    );
};


// =====================================================
// EXPORT
// =====================================================

const TopicService = {

    getAllTopics,

    getStudentTopics,

    getTopicById,

    getTopicsBySubject,

    getTopicsBySubjectForStudent,

    createTopic,

    updateTopic,

    deleteTopic
};

export default TopicService;