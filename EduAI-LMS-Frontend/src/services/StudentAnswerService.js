import api from "../api/axiosConfig";

class StudentAnswerService {

    // =================================================
    // SAVE ANSWER
    // =================================================

    saveAnswer(
        attemptId,
        questionId,
        selectedAnswer
    ) {

        return api.post(
            "/student-answers/save",
            null,
            {
                params: {
                    attemptId,
                    questionId,
                    selectedAnswer
                }
            }
        );
    }


    // =================================================
    // GET ANSWERS BY ATTEMPT
    // =================================================

    getAnswersByAttempt(attemptId) {

        return api.get(
            `/student-answers/attempt/${attemptId}`
        );
    }


    // =================================================
    // DELETE ANSWER
    // =================================================

    deleteAnswer(id) {

        return api.delete(
            `/student-answers/${id}`
        );
    }
}


export default new StudentAnswerService();