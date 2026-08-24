import { useState } from "react";
import AIQuizService from "../services/AIQuizService";

function AIQuizGenerator() {

    // =====================================================
    // STATE
    // =====================================================

    const [subject, setSubject] = useState("Maths");
    const [topic, setTopic] = useState("Algebra");

    const [difficulty, setDifficulty] = useState("Easy");

    const [questionType, setQuestionType] =
        useState("MCQ");

    const [numberOfQuestions, setNumberOfQuestions] =
        useState(5);

    const [quiz, setQuiz] = useState(null);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");


    // =====================================================
    // GENERATE QUIZ
    // =====================================================

    const handleGenerateQuiz = async (event) => {

        event.preventDefault();

        setError("");
        setQuiz(null);

        // -------------------------------------------------
        // BASIC VALIDATION
        // -------------------------------------------------

        if (!subject.trim()) {
            setError("Please enter a subject.");
            return;
        }

        if (!topic.trim()) {
            setError("Please enter a topic.");
            return;
        }

        if (!numberOfQuestions) {
            setError(
                "Please enter the number of questions."
            );
            return;
        }

        const questionCount =
            Number(numberOfQuestions);

        if (
            Number.isNaN(questionCount) ||
            questionCount < 1 ||
            questionCount > 50
        ) {
            setError(
                "Number of questions must be between 1 and 50."
            );
            return;
        }


        // -------------------------------------------------
        // REQUEST
        // -------------------------------------------------

        const requestData = {
            subject: subject.trim(),
            topic: topic.trim(),
            difficulty: difficulty,
            questionType: questionType,
            numberOfQuestions: questionCount,
        };

        console.log(
            "GENERATING AI QUIZ:",
            requestData
        );

        setLoading(true);

        try {

            const response =
                await AIQuizService.generateQuiz(
                    requestData
                );

            console.log(
                "QUIZ RESPONSE:",
                response.data
            );

            setQuiz(response.data);

        } catch (error) {

            console.error(
                "Quiz generation failed:",
                error
            );

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Backend response:",
                error.response?.data
            );


            // -------------------------------------------------
            // DISPLAY ACTUAL BACKEND ERROR
            // -------------------------------------------------

            if (error.response?.status === 400) {

                const backendMessage =
                    error.response?.data?.message ||
                    error.response?.data?.error;

                setError(
                    backendMessage ||
                    "Invalid quiz request. Please check the quiz details."
                );

            } else if (
                error.response?.status === 401
            ) {

                setError(
                    "Your login session has expired. Please log in again."
                );

            } else if (
                error.response?.status === 403
            ) {

                setError(
                    "You are not authorized to generate quizzes."
                );

            } else if (
                error.response?.status >= 500
            ) {

                setError(
                    "The AI server encountered an error. Please try again."
                );

            } else {

                setError(
                    "Failed to generate quiz."
                );
            }

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // RENDER QUIZ
    // =====================================================

    const renderQuiz = () => {

        if (!quiz) {
            return null;
        }

        console.log(
            "Rendering quiz:",
            quiz
        );


        // -------------------------------------------------
        // IF BACKEND RETURNS ARRAY DIRECTLY
        // -------------------------------------------------

        if (Array.isArray(quiz)) {

            return (
                <div className="mt-4">

                    <h4>
                        Generated Quiz
                    </h4>

                    {quiz.map(
                        (question, index) => (

                            <div
                                key={index}
                                className="card mb-3"
                            >

                                <div className="card-body">

                                    <h5>
                                        {index + 1}.{" "}
                                        {question.question ||
                                            question.questionText ||
                                            question.text}
                                    </h5>


                                    {question.options &&
                                        Array.isArray(
                                            question.options
                                        ) && (

                                            <div className="mt-3">

                                                {question.options.map(
                                                    (
                                                        option,
                                                        optionIndex
                                                    ) => (

                                                        <div
                                                            key={
                                                                optionIndex
                                                            }
                                                            className="mb-2"
                                                        >

                                                            <label>

                                                                <input
                                                                    type="radio"
                                                                    name={`question-${index}`}
                                                                    className="me-2"
                                                                />

                                                                {typeof option ===
                                                                "string"
                                                                    ? option
                                                                    : option.text ||
                                                                      option.value ||
                                                                      JSON.stringify(
                                                                          option
                                                                      )}

                                                            </label>

                                                        </div>
                                                    )
                                                )}

                                            </div>
                                        )}

                                </div>

                            </div>
                        )
                    )}

                </div>
            );
        }


        // -------------------------------------------------
        // IF BACKEND RETURNS { questions: [...] }
        // -------------------------------------------------

        if (
            quiz.questions &&
            Array.isArray(quiz.questions)
        ) {

            return (
                <div className="mt-4">

                    <h4>
                        Generated Quiz
                    </h4>

                    {quiz.questions.map(
                        (question, index) => (

                            <div
                                key={index}
                                className="card mb-3"
                            >

                                <div className="card-body">

                                    <h5>
                                        {index + 1}.{" "}
                                        {question.question ||
                                            question.questionText ||
                                            question.text}
                                    </h5>


                                    {question.options &&
                                        Array.isArray(
                                            question.options
                                        ) && (

                                            <div className="mt-3">

                                                {question.options.map(
                                                    (
                                                        option,
                                                        optionIndex
                                                    ) => (

                                                        <div
                                                            key={
                                                                optionIndex
                                                            }
                                                            className="mb-2"
                                                        >

                                                            <label>

                                                                <input
                                                                    type="radio"
                                                                    name={`question-${index}`}
                                                                    className="me-2"
                                                                />

                                                                {typeof option ===
                                                                "string"
                                                                    ? option
                                                                    : option.text ||
                                                                      option.value ||
                                                                      JSON.stringify(
                                                                          option
                                                                      )}

                                                            </label>

                                                        </div>
                                                    )
                                                )}

                                            </div>
                                        )}

                                </div>

                            </div>
                        )
                    )}

                </div>
            );
        }


        // -------------------------------------------------
        // UNKNOWN RESPONSE
        // -------------------------------------------------

        return (
            <div className="alert alert-info mt-4">

                <strong>
                    Quiz generated successfully.
                </strong>

                <pre className="mt-3">
                    {JSON.stringify(
                        quiz,
                        null,
                        2
                    )}
                </pre>

            </div>
        );
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="container mt-4">

            <div className="card shadow">

                {/* HEADER */}

                <div
                    className="card-header bg-primary text-white"
                >

                    <h2 className="mb-0">

                        🤖 AI Quiz Generator

                    </h2>

                </div>


                {/* BODY */}

                <div className="card-body">

                    <form
                        onSubmit={
                            handleGenerateQuiz
                        }
                    >

                        {/* SUBJECT */}

                        <div className="mb-3">

                            <label className="form-label">

                                Subject

                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={subject}
                                onChange={(event) =>
                                    setSubject(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter subject"
                                required
                            />

                        </div>


                        {/* TOPIC */}

                        <div className="mb-3">

                            <label className="form-label">

                                Topic

                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={topic}
                                onChange={(event) =>
                                    setTopic(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter topic"
                                required
                            />

                        </div>


                        {/* OPTIONS */}

                        <div className="row">

                            {/* DIFFICULTY */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label">

                                    Difficulty

                                </label>

                                <select
                                    className="form-select"
                                    value={difficulty}
                                    onChange={(event) =>
                                        setDifficulty(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="Easy">
                                        Easy
                                    </option>

                                    <option value="Medium">
                                        Medium
                                    </option>

                                    <option value="Hard">
                                        Hard
                                    </option>

                                </select>

                            </div>


                            {/* QUESTION TYPE */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label">

                                    Question Type

                                </label>

                                <select
                                    className="form-select"
                                    value={questionType}
                                    onChange={(event) =>
                                        setQuestionType(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="MCQ">
                                        MCQ
                                    </option>

                                    <option value="TRUE_FALSE">
                                        True / False
                                    </option>

                                    <option value="SHORT_ANSWER">
                                        Short Answer
                                    </option>

                                </select>

                            </div>


                            {/* NUMBER OF QUESTIONS */}

                            <div className="col-md-4 mb-3">

                                <label className="form-label">

                                    Number of Questions

                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    max="50"
                                    value={
                                        numberOfQuestions
                                    }
                                    onChange={(event) =>
                                        setNumberOfQuestions(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* GENERATE BUTTON */}

                        <button
                            type="submit"
                            className="btn btn-success"
                            disabled={loading}
                        >

                            {loading
                                ? "Generating..."
                                : "Generate Quiz"}

                        </button>

                    </form>


                    {/* ERROR */}

                    {error && (

                        <div
                            className="alert alert-danger mt-4"
                        >

                            {error}

                        </div>

                    )}


                    {/* QUIZ */}

                    {renderQuiz()}

                </div>

            </div>

        </div>
    );
}

export default AIQuizGenerator;