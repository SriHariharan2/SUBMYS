import api from "../api/axiosConfig";

// =====================================================
// GET ALL QUESTIONS - ADMIN
// =====================================================

const getAll = () => {
    return api.get("/questions");
};


// =====================================================
// GET QUESTIONS BY QUIZ - ADMIN
// =====================================================

const getByQuiz = (quizId) => {
    return api.get(`/questions/quiz/${quizId}`);
};


// =====================================================
// GET QUESTIONS FOR STUDENT
// =====================================================

const getForStudent = (quizId) => {
    return api.get(`/questions/quiz/${quizId}/student`);
};


// =====================================================
// GET QUESTION BY ID
// =====================================================

const getById = (id) => {
    return api.get(`/questions/${id}`);
};


// =====================================================
// CREATE QUESTION
// =====================================================

const create = (quizId, question) => {
    return api.post(
        `/questions/${quizId}`,
        question
    );
};


// =====================================================
// UPDATE QUESTION
// =====================================================

const update = (id, question) => {
    return api.put(
        `/questions/${id}`,
        question
    );
};


// =====================================================
// DELETE QUESTION
// =====================================================

const remove = (id) => {
    return api.delete(
        `/questions/${id}`
    );
};


// =====================================================
// SHUFFLE QUESTIONS
// =====================================================

const shuffle = (quizId) => {
    return api.put(
        `/questions/quiz/${quizId}/shuffle`
    );
};


// =====================================================
// EXPORT
// =====================================================

const QuestionService = {

    getAll,

    getByQuiz,

    getForStudent,

    getById,

    create,

    update,

    remove,

    shuffle

};

export default QuestionService;