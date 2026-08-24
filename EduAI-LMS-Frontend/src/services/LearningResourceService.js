import api from "../api/axiosConfig";

// =====================================================
// GET ALL RESOURCES
// =====================================================
// ADMIN USE
// =====================================================

const getAllResources = () => {
    return api.get("/resources");
};


// =====================================================
// GET RESOURCES FOR STUDENT
// =====================================================
// STUDENT USE
//
// Returns resources only from topics that belong to
// courses where the student is enrolled.
//
// Example:
// /api/resources/student/3
// =====================================================

const getStudentResources = (studentId) => {

    return api.get(
        `/resources/student/${studentId}`
    );
};


// =====================================================
// GET RESOURCE BY ID
// =====================================================

const getResourceById = (id) => {

    return api.get(
        `/resources/${id}`
    );
};


// =====================================================
// GET RESOURCES BY TOPIC
// =====================================================
// ADMIN USE
// =====================================================

const getResourcesByTopic = (topicId) => {

    return api.get(
        `/resources/topic/${topicId}`
    );
};


// =====================================================
// GET RESOURCES BY TOPIC FOR STUDENT
// =====================================================
// STUDENT USE
//
// Backend should verify that the topic belongs to a
// course in which the student is enrolled.
//
// =====================================================

const getResourcesByTopicForStudent = (
    studentId,
    topicId
) => {

    return api.get(
        `/resources/student/${studentId}/topic/${topicId}`
    );
};


// =====================================================
// GET RESOURCE FOR STUDENT
// =====================================================
// STUDENT USE
//
// Backend verifies that the resource belongs to an
// enrolled course.
//
// =====================================================

const getResourceForStudent = (
    studentId,
    resourceId
) => {

    return api.get(
        `/resources/student/${studentId}/${resourceId}`
    );
};


// =====================================================
// CREATE RESOURCE
// =====================================================
// ADMIN USE
// VIDEO / LINK
// =====================================================

const createResource = (
    topicId,
    resource
) => {

    return api.post(
        `/resources/topic/${topicId}`,
        resource
    );
};


// =====================================================
// UPLOAD FILE
// =====================================================
// ADMIN USE
// PDF / PPT
// =====================================================

const uploadResource = (
    topicId,
    formData
) => {

    return api.post(

        `/resources/topic/${topicId}/upload`,

        formData,

        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );
};


// =====================================================
// REPLACE EXISTING FILE
// =====================================================
// ADMIN USE
// =====================================================

const replaceFile = (
    id,
    formData
) => {

    return api.put(

        `/resources/${id}/upload`,

        formData,

        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );
};


// =====================================================
// UPDATE VIDEO / LINK
// =====================================================
// ADMIN USE
// =====================================================

const updateResource = (
    id,
    resource
) => {

    return api.put(
        `/resources/${id}`,
        resource
    );
};


// =====================================================
// DELETE RESOURCE
// =====================================================
// ADMIN USE
// =====================================================

const deleteResource = (
    id
) => {

    return api.delete(
        `/resources/${id}`
    );
};


// =====================================================
// EXPORT
// =====================================================

const LearningResourceService = {

    // Admin
    getAllResources,

    // Student
    getStudentResources,

    getResourceById,

    // Admin
    getResourcesByTopic,

    // Student
    getResourcesByTopicForStudent,

    getResourceForStudent,

    // Admin
    createResource,

    uploadResource,

    replaceFile,

    updateResource,

    deleteResource
};


export default LearningResourceService;