import api from "../api/axiosConfig";

// =====================================================
// GET ALL SUBMISSIONS
// =====================================================

const getAllSubmissions = () => {
    return api.get("/submissions");
};


// =====================================================
// GET SUBMISSION BY ID
// =====================================================

const getSubmissionById = (id) => {
    return api.get(`/submissions/${id}`);
};


// =====================================================
// GET SUBMISSIONS BY STUDENT
// =====================================================

const getStudentSubmissions = (studentId) => {
    console.log("GET STUDENT SUBMISSIONS");
    console.log("Student ID:", studentId);

    return api.get(`/submissions/student/${studentId}`);
};


// =====================================================
// GET SUBMISSIONS BY ASSIGNMENT
// =====================================================

const getAssignmentSubmissions = (assignmentId) => {
    return api.get(`/submissions/assignment/${assignmentId}`);
};


// =====================================================
// SUBMIT ASSIGNMENT
// =====================================================

const submitAssignment = (
    studentId,
    assignmentId,
    submission
) => {

    console.log("SUBMIT ASSIGNMENT");
    console.log("Student ID:", studentId);
    console.log("Assignment ID:", assignmentId);
    console.log("Submission:", submission);

    return api.post(
        `/submissions/${studentId}/${assignmentId}`,
        submission
    );
};


// =====================================================
// GRADE SUBMISSION
// =====================================================

const gradeSubmission = (
    submissionId,
    marks,
    feedback
) => {

    return api.put(
        `/submissions/${submissionId}/grade`,
        null,
        {
            params: {
                marks,
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
        `/submissions/${id}`
    );
};


// =====================================================
// EXPORT
// =====================================================

const AssignmentSubmissionService = {

    getAllSubmissions,

    getSubmissionById,

    getStudentSubmissions,

    getAssignmentSubmissions,

    submitAssignment,

    gradeSubmission,

    deleteSubmission

};

export default AssignmentSubmissionService;