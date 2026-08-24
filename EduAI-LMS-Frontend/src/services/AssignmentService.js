import api from "../api/axiosConfig";

// =====================================================
// GET ALL ASSIGNMENTS
// =====================================================
// ADMIN USE
// =====================================================

const getAllAssignments = () => {

    return api.get(
        "/assignments"
    );
};


// =====================================================
// GET ASSIGNMENTS FOR STUDENT
// =====================================================
// STUDENT USE
//
// Only assignments from the student's enrolled courses.
//
// Example:
// /api/assignments/student/3
// =====================================================

const getStudentAssignments = (
    studentId
) => {

    return api.get(
        `/assignments/student/${studentId}`
    );
};


// =====================================================
// GET ASSIGNMENT BY ID
// =====================================================

const getAssignmentById = (
    id
) => {

    return api.get(
        `/assignments/${id}`
    );
};


// =====================================================
// GET ASSIGNMENT FOR STUDENT
// =====================================================
//
// Also verifies that the student belongs to the course.
//
// =====================================================

const getAssignmentForStudent = (
    studentId,
    assignmentId
) => {

    return api.get(
        `/assignments/student/${studentId}/${assignmentId}`
    );
};


// =====================================================
// GET ASSIGNMENTS BY TOPIC
// =====================================================
// ADMIN USE
// =====================================================

const getAssignmentsByTopic = (
    topicId
) => {

    return api.get(
        `/assignments/topic/${topicId}`
    );
};


// =====================================================
// GET ASSIGNMENTS BY TOPIC FOR STUDENT
// =====================================================

const getAssignmentsByTopicForStudent = (
    studentId,
    topicId
) => {

    return api.get(
        `/assignments/student/${studentId}/topic/${topicId}`
    );
};


// =====================================================
// CREATE ASSIGNMENT
// =====================================================
// ADMIN USE
// =====================================================

const createAssignment = (
    topicId,
    assignment
) => {

    return api.post(
        `/assignments/${topicId}`,
        assignment
    );
};


// =====================================================
// UPDATE ASSIGNMENT
// =====================================================
// ADMIN USE
// =====================================================

const updateAssignment = (
    id,
    assignment
) => {

    return api.put(
        `/assignments/${id}`,
        assignment
    );
};


// =====================================================
// DELETE ASSIGNMENT
// =====================================================
// ADMIN USE
// =====================================================

const deleteAssignment = (
    id
) => {

    return api.delete(
        `/assignments/${id}`
    );
};


// =====================================================
// EXPORT
// =====================================================

const AssignmentService = {

    getAllAssignments,

    getStudentAssignments,

    getAssignmentById,

    getAssignmentForStudent,

    getAssignmentsByTopic,

    getAssignmentsByTopicForStudent,

    createAssignment,

    updateAssignment,

    deleteAssignment
};

export default AssignmentService;