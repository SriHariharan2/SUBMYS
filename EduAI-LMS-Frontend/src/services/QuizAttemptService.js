import api from "../api/axiosConfig";

// =====================================================
// START / RESUME QUIZ
// =====================================================

const startQuiz = (studentId, quizId) => {

    return api.post(
        `/quiz-attempts/start/${studentId}/${quizId}`
    );

};


// =====================================================
// GET ALL ATTEMPTS
// =====================================================

const getAllAttempts = () => {

    return api.get(
        "/quiz-attempts"
    );

};


// =====================================================
// GET ATTEMPT BY ID
// =====================================================

const getAttemptById = (id) => {

    return api.get(
        `/quiz-attempts/${id}`
    );

};


// =====================================================
// GET ATTEMPTS BY STUDENT
// =====================================================

const getAttemptsByStudent = (studentId) => {

    return api.get(
        `/quiz-attempts/student/${studentId}`
    );

};


// =====================================================
// GET ATTEMPTS BY QUIZ
// =====================================================

const getAttemptsByQuiz = (quizId) => {

    return api.get(
        `/quiz-attempts/quiz/${quizId}`
    );

};


// =====================================================
// GET ATTEMPT BY STUDENT + QUIZ
// =====================================================

const getAttemptByStudentAndQuiz = (
    studentId,
    quizId
) => {

    return api.get(
        `/quiz-attempts/student/${studentId}/quiz/${quizId}`
    );

};


// =====================================================
// GET ATTEMPT SUMMARY
// =====================================================
//
// Returns:
//
// {
//     studentId: 3,
//     quizId: 2,
//     attemptCount: 1,
//     maxAttempts: 2,
//     remainingAttempts: 1,
//     attempted: true,
//     completed: true,
//     status: "COMPLETED",
//     score: 15,
//     totalMarks: 20
// }
//
// =====================================================

const getAttemptSummary = (
    studentId,
    quizId
) => {

    return api.get(
        `/quiz-attempts/student/${studentId}/quiz/${quizId}/summary`
    );

};


// =====================================================
// SUBMIT QUIZ
// =====================================================

const submitQuiz = (attemptId) => {

    return api.put(
        `/quiz-attempts/${attemptId}/submit`
    );

};


// =====================================================
// DELETE ATTEMPT
// =====================================================

const deleteAttempt = (attemptId) => {

    return api.delete(
        `/quiz-attempts/${attemptId}`
    );

};


// =====================================================
// EXPORT
// =====================================================

const QuizAttemptService = {

    startQuiz,

    getAllAttempts,

    getAttemptById,

    getAttemptsByStudent,

    getAttemptsByQuiz,

    getAttemptByStudentAndQuiz,

    getAttemptSummary,

    submitQuiz,

    deleteAttempt

};


export default QuizAttemptService;