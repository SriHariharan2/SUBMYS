import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import QuizService from "../../services/QuizService";
import QuestionService from "../../services/QuestionService";

function AddQuestion() {

    const navigate = useNavigate();

    // =====================================================
    // QUIZZES
    // =====================================================

    const [quizzes, setQuizzes] = useState([]);
    const [quizId, setQuizId] = useState("");

    // =====================================================
    // QUESTIONS
    // =====================================================

    const [questions, setQuestions] = useState([]);

    // =====================================================
    // FORM
    // =====================================================

    const [questionText, setQuestionText] = useState("");
    const [optionA, setOptionA] = useState("");
    const [optionB, setOptionB] = useState("");
    const [optionC, setOptionC] = useState("");
    const [optionD, setOptionD] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState("");
    const [marks, setMarks] = useState(1);

    // =====================================================
    // EDIT
    // =====================================================

    const [editingId, setEditingId] = useState(null);

    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] = useState(false);
    const [questionsLoading, setQuestionsLoading] = useState(false);
    const [shuffleLoading, setShuffleLoading] = useState(false);

    // =====================================================
    // LOAD QUIZZES
    // =====================================================

    useEffect(() => {
        loadQuizzes();
    }, []);

    const loadQuizzes = async () => {

        try {

            const response =
                await QuizService.getAllQuizzes();

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : [];

            setQuizzes(data);

        } catch (error) {

            console.error(
                "Failed to load quizzes:",
                error
            );

            alert("Failed to load quizzes.");
        }
    };

    // =====================================================
    // QUIZ CHANGE
    // =====================================================

    const handleQuizChange = async (e) => {

        const selectedQuizId = e.target.value;

        setQuizId(selectedQuizId);

        resetForm();

        if (!selectedQuizId) {
            setQuestions([]);
            return;
        }

        await loadQuestions(selectedQuizId);
    };

    // =====================================================
    // LOAD QUESTIONS
    // =====================================================

    const loadQuestions = async (selectedQuizId) => {

        if (!selectedQuizId) {
            setQuestions([]);
            return;
        }

        try {

            setQuestionsLoading(true);

            const response =
                await QuestionService.getByQuiz(
                    selectedQuizId
                );

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : [];

            // Make sure questions are displayed
            // according to questionOrder.
            const sortedQuestions = [...data].sort(
                (a, b) =>
                    (a.questionOrder ?? 999999) -
                    (b.questionOrder ?? 999999)
            );

            setQuestions(sortedQuestions);

        } catch (error) {

            console.error(
                "Failed to load questions:",
                error
            );

            setQuestions([]);

            alert(
                error.response?.data?.message ||
                "Failed to load questions."
            );

        } finally {

            setQuestionsLoading(false);
        }
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {

        setQuestionText("");
        setOptionA("");
        setOptionB("");
        setOptionC("");
        setOptionD("");
        setCorrectAnswer("");
        setMarks(1);
        setEditingId(null);
    };

    // =====================================================
    // CREATE / UPDATE
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!quizId) {

            alert("Please select a quiz.");
            return;
        }

        if (!questionText.trim()) {

            alert("Please enter the question.");
            return;
        }

        if (!optionA.trim() ||
            !optionB.trim() ||
            !optionC.trim() ||
            !optionD.trim()) {

            alert("Please enter all four options.");
            return;
        }

        if (!correctAnswer) {

            alert("Please select the correct answer.");
            return;
        }

        if (!marks || Number(marks) <= 0) {

            alert("Marks must be greater than 0.");
            return;
        }

        const question = {

            questionText: questionText.trim(),

            optionA: optionA.trim(),

            optionB: optionB.trim(),

            optionC: optionC.trim(),

            optionD: optionD.trim(),

            correctAnswer: correctAnswer,

            marks: Number(marks)
        };

        try {

            setLoading(true);

            // =================================================
            // UPDATE EXISTING QUESTION
            // =================================================

            if (editingId !== null) {

                await QuestionService.update(
                    editingId,
                    question
                );

                alert(
                    "Question updated successfully."
                );

            }

            // =================================================
            // CREATE NEW QUESTION
            // =================================================

            else {

                await QuestionService.create(
                    Number(quizId),
                    question
                );

                alert(
                    "Question added successfully."
                );
            }

            resetForm();

            await loadQuestions(quizId);

        } catch (error) {

            console.error(
                "Question save error:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Unable to save question."
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // EDIT QUESTION
    // =====================================================

    const handleEdit = (question) => {

        setEditingId(question.id);

        setQuestionText(
            question.questionText || ""
        );

        setOptionA(
            question.optionA || ""
        );

        setOptionB(
            question.optionB || ""
        );

        setOptionC(
            question.optionC || ""
        );

        setOptionD(
            question.optionD || ""
        );

        setCorrectAnswer(
            question.correctAnswer || ""
        );

        setMarks(
            question.marks ?? 1
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =====================================================
    // DELETE QUESTION
    // =====================================================

    const handleDelete = async (questionId) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this question?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await QuestionService.remove(
                questionId
            );

            alert(
                "Question deleted successfully."
            );

            if (editingId === questionId) {
                resetForm();
            }

            await loadQuestions(quizId);

        } catch (error) {

            console.error(
                "Delete question error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete question."
            );
        }
    };

    // =====================================================
    // SHUFFLE QUESTIONS
    // =====================================================

    const handleShuffle = async () => {

        if (!quizId) {

            alert(
                "Please select a quiz first."
            );

            return;
        }

        if (questions.length < 2) {

            alert(
                "At least two questions are required to shuffle."
            );

            return;
        }

        const confirmed =
            window.confirm(
                "Shuffle the questions in this quiz?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setShuffleLoading(true);

            /*
             * IMPORTANT:
             *
             * This calls:
             *
             * PUT /api/questions/quiz/{quizId}/shuffle
             *
             * The backend QuestionController must contain
             * the same PUT endpoint.
             */

            const response =
                await QuestionService.shuffle(
                    Number(quizId)
                );

            // The backend returns the newly shuffled
            // questions, so display them immediately.
            if (Array.isArray(response.data)) {

                const shuffledQuestions =
                    [...response.data].sort(
                        (a, b) =>
                            (a.questionOrder ?? 999999) -
                            (b.questionOrder ?? 999999)
                    );

                setQuestions(
                    shuffledQuestions
                );

            } else {

                await loadQuestions(
                    quizId
                );
            }

            alert(
                "Questions shuffled successfully."
            );

        } catch (error) {

            console.error(
                "Shuffle questions error:",
                error
            );

            console.error(
                "Shuffle URL:",
                `/api/questions/quiz/${quizId}/shuffle`
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            if (
                error.response?.status === 404
            ) {

                alert(
                    "Shuffle API was not found. Restart the Spring Boot backend and make sure QuestionController contains PUT /api/questions/quiz/{quizId}/shuffle."
                );

            } else {

                alert(
                    error.response?.data?.message ||
                    "Unable to shuffle questions."
                );
            }

        } finally {

            setShuffleLoading(false);
        }
    };

    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const cancelEdit = () => {
        resetForm();
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <div className="container mt-4">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    d-flex
                    justify-content-between
                    align-items-center
                    mb-4
                "
            >

                <h2>
                    {editingId !== null
                        ? "Edit Question"
                        : "Question Management"}
                </h2>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate("/quizzes")
                    }
                >
                    Back to Quizzes
                </button>

            </div>

            {/* ================================================= */}
            {/* SELECT QUIZ */}
            {/* ================================================= */}

            <div className="card shadow mb-4">

                <div className="card-body">

                    <label className="form-label">
                        Select Quiz
                    </label>

                    <select
                        className="form-select"
                        value={quizId}
                        onChange={handleQuizChange}
                    >

                        <option value="">
                            -- Select Quiz --
                        </option>

                        {quizzes.map((quiz) => (

                            <option
                                key={quiz.id}
                                value={quiz.id}
                            >
                                {quiz.title}
                                {" "}
                                (ID: {quiz.id})
                            </option>

                        ))}

                    </select>

                </div>

            </div>

            {/* ================================================= */}
            {/* QUESTION FORM */}
            {/* ================================================= */}

            {quizId && (

                <div className="card shadow mb-4">

                    <div className="card-header">

                        <h5 className="mb-0">

                            {editingId !== null
                                ? "Edit Question"
                                : "Add Question"}

                        </h5>

                    </div>

                    <div className="card-body">

                        <form
                            onSubmit={handleSubmit}
                        >

                            {/* QUESTION */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Question
                                </label>

                                <textarea
                                    className="form-control"
                                    rows="4"
                                    value={questionText}
                                    onChange={(e) =>
                                        setQuestionText(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter question"
                                    required
                                />

                            </div>

                            {/* OPTION A */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Option A
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={optionA}
                                    onChange={(e) =>
                                        setOptionA(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            {/* OPTION B */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Option B
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={optionB}
                                    onChange={(e) =>
                                        setOptionB(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            {/* OPTION C */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Option C
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={optionC}
                                    onChange={(e) =>
                                        setOptionC(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            {/* OPTION D */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Option D
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={optionD}
                                    onChange={(e) =>
                                        setOptionD(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            {/* CORRECT ANSWER */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Correct Answer
                                </label>

                                <select
                                    className="form-select"
                                    value={correctAnswer}
                                    onChange={(e) =>
                                        setCorrectAnswer(
                                            e.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        -- Select Correct Answer --
                                    </option>

                                    <option value="A">
                                        A
                                    </option>

                                    <option value="B">
                                        B
                                    </option>

                                    <option value="C">
                                        C
                                    </option>

                                    <option value="D">
                                        D
                                    </option>

                                </select>

                            </div>

                            {/* MARKS */}

                            <div className="mb-4">

                                <label className="form-label">
                                    Marks
                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    min="1"
                                    value={marks}
                                    onChange={(e) =>
                                        setMarks(
                                            e.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                            {/* BUTTONS */}

                            <button
                                type="submit"
                                className="btn btn-success me-2"
                                disabled={loading}
                            >

                                {loading
                                    ? "Saving..."
                                    : editingId !== null
                                        ? "Update Question"
                                        : "Add Question"}

                            </button>

                            {editingId !== null && (

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={cancelEdit}
                                >
                                    Cancel Edit
                                </button>

                            )}

                        </form>

                    </div>

                </div>

            )}

            {/* ================================================= */}
            {/* QUESTION LIST */}
            {/* ================================================= */}

            {quizId && (

                <div className="card shadow">

                    <div
                        className="
                            card-header
                            d-flex
                            justify-content-between
                            align-items-center
                        "
                    >

                        <h5 className="mb-0">

                            Questions

                            {" "}

                            <span className="badge bg-primary">
                                {questions.length}
                            </span>

                        </h5>

                        <button
                            type="button"
                            className="btn btn-warning"
                            onClick={handleShuffle}
                            disabled={
                                questionsLoading ||
                                shuffleLoading ||
                                questions.length < 2
                            }
                        >

                            {shuffleLoading
                                ? "Shuffling..."
                                : "🔀 Shuffle Questions"}

                        </button>

                    </div>

                    <div className="card-body">

                        {questionsLoading ? (

                            <div className="text-center py-4">

                                <div
                                    className="spinner-border"
                                    role="status"
                                />

                                <p className="mt-2">
                                    Loading questions...
                                </p>

                            </div>

                        ) : questions.length === 0 ? (

                            <div className="alert alert-info">

                                No questions added
                                to this quiz yet.

                            </div>

                        ) : (

                            <div>

                                {questions.map(
                                    (question, index) => (

                                        <div
                                            key={question.id}
                                            className="card mb-3 border"
                                        >

                                            <div className="card-body">

                                                {/* QUESTION HEADER */}

                                                <div
                                                    className="
                                                        d-flex
                                                        justify-content-between
                                                        align-items-start
                                                        mb-3
                                                    "
                                                >

                                                    <div>

                                                        <span
                                                            className="
                                                                badge
                                                                bg-dark
                                                                me-2
                                                            "
                                                        >

                                                            Q{
                                                                question.questionOrder ??
                                                                index + 1
                                                            }

                                                        </span>

                                                        <strong>
                                                            {
                                                                question.questionText
                                                            }
                                                        </strong>

                                                    </div>

                                                    <span
                                                        className="
                                                            badge
                                                            bg-success
                                                        "
                                                    >

                                                        {
                                                            question.marks
                                                        }

                                                        {" "}
                                                        mark(s)

                                                    </span>

                                                </div>

                                                {/* OPTIONS */}

                                                <div className="row">

                                                    <div className="col-md-6 mb-2">

                                                        <div
                                                            className="
                                                                border
                                                                rounded
                                                                p-2
                                                            "
                                                        >

                                                            <strong>
                                                                A.
                                                            </strong>

                                                            {" "}

                                                            {
                                                                question.optionA
                                                            }

                                                        </div>

                                                    </div>

                                                    <div className="col-md-6 mb-2">

                                                        <div
                                                            className="
                                                                border
                                                                rounded
                                                                p-2
                                                            "
                                                        >

                                                            <strong>
                                                                B.
                                                            </strong>

                                                            {" "}

                                                            {
                                                                question.optionB
                                                            }

                                                        </div>

                                                    </div>

                                                    <div className="col-md-6 mb-2">

                                                        <div
                                                            className="
                                                                border
                                                                rounded
                                                                p-2
                                                            "
                                                        >

                                                            <strong>
                                                                C.
                                                            </strong>

                                                            {" "}

                                                            {
                                                                question.optionC
                                                            }

                                                        </div>

                                                    </div>

                                                    <div className="col-md-6 mb-2">

                                                        <div
                                                            className="
                                                                border
                                                                rounded
                                                                p-2
                                                            "
                                                        >

                                                            <strong>
                                                                D.
                                                            </strong>

                                                            {" "}

                                                            {
                                                                question.optionD
                                                            }

                                                        </div>

                                                    </div>

                                                </div>

                                                {/* CORRECT ANSWER */}

                                                <div className="mt-2">

                                                    <span
                                                        className="
                                                            badge
                                                            bg-success
                                                        "
                                                    >

                                                        Correct:
                                                        {" "}
                                                        {
                                                            question.correctAnswer
                                                        }

                                                    </span>

                                                </div>

                                                {/* ACTIONS */}

                                                <div className="mt-3">

                                                    <button
                                                        type="button"
                                                        className="
                                                            btn
                                                            btn-warning
                                                            btn-sm
                                                            me-2
                                                        "
                                                        onClick={() =>
                                                            handleEdit(
                                                                question
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="
                                                            btn
                                                            btn-danger
                                                            btn-sm
                                                        "
                                                        onClick={() =>
                                                            handleDelete(
                                                                question.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        )}

                    </div>

                </div>

            )}

        </div>
    );
}

export default AddQuestion;