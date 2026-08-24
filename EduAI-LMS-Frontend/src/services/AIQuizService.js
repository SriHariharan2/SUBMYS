import api from "../api/axiosConfig";

// =====================================================
// AI QUIZ SERVICE
// =====================================================

const generateQuiz = async ({
    subject,
    topic,
    difficulty,
    questionType,
    numberOfQuestions,
}) => {

    const requestData = {

        subject:
            subject?.trim() || "",

        topic:
            topic?.trim() || "",

        difficulty:
            difficulty || "Easy",

        questionType:
            questionType || "MCQ",

        numberOfQuestions:
            Number(numberOfQuestions),
    };

    console.log(
        "======================================"
    );

    console.log(
        "AI QUIZ REQUEST"
    );

    console.log(
        requestData
    );

    console.log(
        "======================================"
    );

    try {

        const response =
            await api.post(
                "/ai/quiz",
                requestData
            );

        console.log(
            "======================================"
        );

        console.log(
            "AI QUIZ RESPONSE"
        );

        console.log(
            response.data
        );

        console.log(
            "======================================"
        );

        return response;

    } catch (error) {

        console.error(
            "======================================"
        );

        console.error(
            "AI QUIZ ERROR"
        );

        console.error(
            "======================================"
        );

        console.error(
            error
        );

        console.error(
            "Status:",
            error.response?.status
        );

        console.error(
            "Data:",
            error.response?.data
        );

        throw error;
    }
};

const AIQuizService = {
    generateQuiz,
};

export default AIQuizService;