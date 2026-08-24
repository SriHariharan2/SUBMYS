import api from "../api/axiosConfig";

// =====================================================
// GET ALL SUBMISSIONS
// =====================================================

const getAllSubmissions = () => {

    return api.get(
        "/assignment-submissions"
    );

};

// =====================================================
// GET SUBMISSION BY ID
// =====================================================

const getSubmissionById = (id) => {

    return api.get(
        `/assignment-submissions/${id}`
    );

};

// =====================================================
// GET SUBMISSIONS BY STUDENT
// =====================================================

const getStudentSubmissions = (studentId) => {

    return api.get(
        `/assignment-submissions/student/${studentId}`
    );

};

// =====================================================
// GET SUBMISSIONS BY ASSIGNMENT
// =====================================================

const getAssignmentSubmissions = (assignmentId) => {

    return api.get(
        `/assignment-submissions/assignment/${assignmentId}`
    );

};

// =====================================================
// SUBMIT ASSIGNMENT
// =====================================================

const submitAssignment = (
    studentId,
    assignmentId,
    submission
) => {

    return api.post(

        `/assignment-submissions/assignment/${assignmentId}/student/${studentId}`,

        submission

    );

};

// =====================================================
// GRADE SUBMISSION
// =====================================================

const gradeSubmission = (
    submissionId,
    score,
    feedback
) => {

    return api.put(

        `/assignment-submissions/${submissionId}/grade`,

        null,

        {
            params: {
                score,
                feedback
            }
        }

    );

};

// =====================================================
// DELETE SUBMISSION
// =====================================================

const deleteSubmission = (id) => {

    return api.delete(
        `/assignment-submissions/${id}`
    );

};

// =====================================================
// SERVICE
// =====================================================

const SubmissionService = {

    getAllSubmissions,

    getSubmissionById,

    getStudentSubmissions,

    getAssignmentSubmissions,

    submitAssignment,

    gradeSubmission,

    deleteSubmission

};

export default SubmissionService;