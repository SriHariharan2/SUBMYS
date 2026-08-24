import api from "../api/axiosConfig";

// =====================================================
// GET ALL QUIZZES
// =====================================================
// ADMIN USE
// =====================================================

const getAllQuizzes = () => {
    return api.get("/quizzes");
};


// =====================================================
// GET QUIZZES FOR STUDENT
// =====================================================
// STUDENT USE
//
// Only quizzes from courses where the student is enrolled.
//
// Example:
// /api/quizzes/student/3
// =====================================================

const getStudentQuizzes = (studentId) => {

    return api.get(
        `/quizzes/student/${studentId}`
    );
};


// =====================================================
// GET QUIZ BY ID
// =====================================================

const getQuizById = (id) => {

    return api.get(
        `/quizzes/${id}`
    );
};


// =====================================================
// GET QUIZZES BY TOPIC
// =====================================================

const getQuizzesByTopic = (topicId) => {

    return api.get(
        `/quizzes/topic/${topicId}`
    );
};


// =====================================================
// GET QUIZZES BY TOPIC FOR STUDENT
// =====================================================

const getQuizzesByTopicForStudent = (
    studentId,
    topicId
) => {

    return api.get(
        `/quizzes/student/${studentId}/topic/${topicId}`
    );
};


// =====================================================
// GET QUESTIONS BY QUIZ
// =====================================================

const getQuestionsByQuiz = (quizId) => {

    return api.get(
        `/questions/quiz/${quizId}`
    );
};


// =====================================================
// CREATE QUESTION
// =====================================================
// ADMIN USE
// =====================================================

const createQuestion = (
    quizId,
    question
) => {

    return api.post(
        `/questions/${quizId}`,
        question
    );
};


// =====================================================
// CREATE QUIZ
// =====================================================
// ADMIN USE
// =====================================================

const createQuiz = (
    topicId,
    quiz
) => {

    return api.post(
        `/quizzes/${topicId}`,
        quiz
    );
};


// =====================================================
// UPDATE QUIZ
// =====================================================
// ADMIN USE
// =====================================================

const updateQuiz = (
    id,
    quiz
) => {

    return api.put(
        `/quizzes/${id}`,
        quiz
    );
};


// =====================================================
// DELETE QUIZ
// =====================================================
// ADMIN USE
// =====================================================

const deleteQuiz = (id) => {

    return api.delete(
        `/quizzes/${id}`
    );
};


// =====================================================
// EXPORT
// =====================================================

const QuizService = {

    getAllQuizzes,

    getStudentQuizzes,

    getQuizById,

    getQuizzesByTopic,

    getQuizzesByTopicForStudent,

    getQuestionsByQuiz,

    createQuestion,

    createQuiz,

    updateQuiz,

    deleteQuiz
};

export default QuizService;