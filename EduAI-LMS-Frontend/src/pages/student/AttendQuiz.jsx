import React, {
    useEffect,
    useMemo,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import QuizService from "../../services/QuizService";
import QuizAttemptService from "../../services/QuizAttemptService";
import StudentAnswerService from "../../services/StudentAnswerService";


// ============================================================
// ATTEND QUIZ
// ============================================================

function AttendQuiz() {

    const { quizId } = useParams();

    const navigate = useNavigate();


    // ========================================================
    // STATE
    // ========================================================

    const [quiz, setQuiz] = useState(null);

    const [questions, setQuestions] = useState([]);

    const [answers, setAnswers] = useState({});

    const [attemptId, setAttemptId] = useState(null);

    const [attemptStatus, setAttemptStatus] =
        useState(null);

    const [score, setScore] = useState(0);

    const [totalMarks, setTotalMarks] =
        useState(0);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const [quizCompleted, setQuizCompleted] =
        useState(false);

    const [canAttemptAgain, setCanAttemptAgain] =
        useState(false);

    const [timeLeft, setTimeLeft] =
        useState(null);


    // ========================================================
    // CURRENT USER
    // ========================================================

    const getCurrentUser = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {
                return null;
            }

            return JSON.parse(storedUser);

        } catch (err) {

            console.error(
                "Unable to read logged-in user:",
                err
            );

            return null;
        }
    };


    // ========================================================
    // STUDENT ID
    // ========================================================

    const getStudentId = () => {

        const user = getCurrentUser();

        if (!user) {
            return null;
        }

        return (
            user.id ??
            user.userId ??
            user.studentId ??
            null
        );
    };


    // ========================================================
    // RESPONSE DATA
    // ========================================================

    const getResponseData = (response) => {

        if (!response) {
            return null;
        }

        let data = response.data;

        if (
            data !== null &&
            typeof data === "object"
        ) {
            return data;
        }

        if (typeof data === "string") {

            try {

                return JSON.parse(data);

            } catch (err) {

                console.error(
                    "Invalid JSON response:",
                    err
                );

                return null;
            }
        }

        return null;
    };


    // ========================================================
    // NORMALIZE ATTEMPT
    // ========================================================

    const normalizeAttempt = (attempt) => {

        if (!attempt) {
            return null;
        }

        const id =
            attempt.id ??
            attempt.attemptId ??
            null;

        if (!id) {
            return null;
        }

        const studentId =
            attempt.studentId ??
            attempt.student?.id ??
            null;

        const currentQuizId =
            attempt.quizId ??
            attempt.quiz?.id ??
            null;

        const attemptScore =
            attempt.score ?? 0;

        const attemptTotalMarks =
            attempt.totalMarks ??
            attempt.quiz?.totalMarks ??
            0;

        const status =
            attempt.status ??
            "UNKNOWN";

        return {

            id,

            studentId,

            quizId: currentQuizId,

            score:
                Number(attemptScore) || 0,

            totalMarks:
                Number(attemptTotalMarks) || 0,

            status:
                String(status).toUpperCase(),

            startedAt:
                attempt.startedAt ?? null,

            submittedAt:
                attempt.submittedAt ?? null
        };
    };


    // ========================================================
    // LOAD SAVED ANSWERS
    // ========================================================

    const loadSavedAnswers = async (id) => {

        if (!id) {
            return;
        }

        try {

            const response =
                await StudentAnswerService
                    .getAnswersByAttempt(id);

            const data =
                getResponseData(response);

            if (!Array.isArray(data)) {
                return;
            }

            const restoredAnswers = {};

            data.forEach((answer) => {

                if (!answer) {
                    return;
                }

                const questionId =
                    answer.questionId ??
                    answer.question?.id;

                const selectedAnswer =
                    answer.selectedAnswer;

                if (
                    questionId !== null &&
                    questionId !== undefined
                ) {

                    restoredAnswers[
                        String(questionId)
                    ] = selectedAnswer;
                }
            });

            setAnswers(restoredAnswers);

        } catch (err) {

            console.warn(
                "Unable to load saved answers:",
                err
            );
        }
    };


    // ========================================================
    // GET ALL STUDENT ATTEMPTS FOR THIS QUIZ
    // ========================================================

    const getQuizAttempts = async (
        studentId,
        numericQuizId
    ) => {

        const response =
            await QuizAttemptService
                .getAttemptsByStudent(studentId);

        const data =
            getResponseData(response);

        const allAttempts =
            Array.isArray(data)
                ? data
                : [];

        const quizAttempts =
            allAttempts
                .map(normalizeAttempt)
                .filter(
                    attempt =>
                        attempt &&
                        Number(attempt.quizId) ===
                        Number(numericQuizId)
                );

        return quizAttempts;
    };


    // ========================================================
    // CHECK NEXT ATTEMPT
    // ========================================================

    const checkNextAttemptAvailability =
        async (
            studentId,
            numericQuizId,
            quizData
        ) => {

            try {

                const attempts =
                    await getQuizAttempts(
                        studentId,
                        numericQuizId
                    );

                const maxAttempts =
                    Number(
                        quizData?.maxAttempts ?? 1
                    );

                const available =
                    attempts.length <
                    maxAttempts;

                console.log(
                    "ATTEMPT CHECK",
                    {
                        attempts:
                            attempts.length,

                        maxAttempts,

                        available
                    }
                );

                setCanAttemptAgain(
                    available
                );

                return available;

            } catch (err) {

                console.error(
                    "Unable to check attempts:",
                    err
                );

                setCanAttemptAgain(false);

                return false;
            }
        };


    // ========================================================
    // START NEW / NEXT ATTEMPT
    // ========================================================

    const handleNextAttempt = async () => {

        if (
            !quiz ||
            !canAttemptAgain
        ) {
            return;
        }

        try {

            setLoading(true);

            setError("");

            const studentId =
                getStudentId();

            if (!studentId) {

                throw new Error(
                    "Student information not found. Please login again."
                );
            }

            const numericQuizId =
                Number(quizId);


            // -----------------------------------------------
            // CHECK AGAIN BEFORE STARTING
            // -----------------------------------------------

            const attempts =
                await getQuizAttempts(
                    studentId,
                    numericQuizId
                );

            const maxAttempts =
                Number(
                    quiz.maxAttempts ?? 1
                );

            if (
                attempts.length >=
                maxAttempts
            ) {

                setCanAttemptAgain(false);

                throw new Error(
                    "You have used all attempts for this quiz."
                );
            }


            // -----------------------------------------------
            // START NEW ATTEMPT
            // -----------------------------------------------

            const response =
                await QuizAttemptService
                    .startQuiz(
                        studentId,
                        numericQuizId
                    );

            const data =
                getResponseData(response);

            const newAttempt =
                normalizeAttempt(data);

            if (!newAttempt) {

                throw new Error(
                    "Backend did not return a valid new attempt."
                );
            }


            console.log(
                "NEW ATTEMPT STARTED:",
                newAttempt
            );


            // -----------------------------------------------
            // RESET EVERYTHING
            // -----------------------------------------------

            setAttemptId(
                newAttempt.id
            );

            setAttemptStatus(
                newAttempt.status ||
                "IN_PROGRESS"
            );

            setScore(
                newAttempt.score || 0
            );

            setTotalMarks(
                newAttempt.totalMarks ||
                quiz.totalMarks ||
                0
            );

            setAnswers({});

            setQuizCompleted(false);

            setCanAttemptAgain(false);


            // -----------------------------------------------
            // START TIMER
            // -----------------------------------------------

            startTimer(
                quiz,
                newAttempt
            );

        } catch (err) {

            console.error(
                "Unable to start next attempt:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Unable to start next attempt.";

            setError(message);

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // LOAD QUIZ
    // ========================================================

    const loadQuiz = async () => {

        setLoading(true);

        setError("");

        try {

            const studentId =
                getStudentId();

            if (!studentId) {

                throw new Error(
                    "Student information not found. Please login again."
                );
            }

            if (!quizId) {

                throw new Error(
                    "Quiz ID is missing."
                );
            }

            const numericQuizId =
                Number(quizId);


            // =================================================
            // LOAD QUIZ
            // =================================================

            const quizResponse =
                await QuizService
                    .getQuizById(
                        numericQuizId
                    );

            const quizData =
                getResponseData(
                    quizResponse
                );

            if (!quizData) {

                throw new Error(
                    "Unable to load quiz."
                );
            }

            setQuiz(quizData);


            const quizTotalMarks =
                Number(
                    quizData.totalMarks ?? 0
                );

            setTotalMarks(
                quizTotalMarks
            );


            // =================================================
            // LOAD QUESTIONS
            // =================================================

            const questionResponse =
                await QuizService
                    .getQuestionsByQuiz(
                        numericQuizId
                    );

            const questionData =
                getResponseData(
                    questionResponse
                );

            const questionList =
                Array.isArray(questionData)
                    ? questionData
                    : [];

            setQuestions(
                questionList
            );


            // =================================================
            // LOAD ALL ATTEMPTS
            // =================================================

            const attempts =
                await getQuizAttempts(
                    studentId,
                    numericQuizId
                );


            console.log(
                "ALL QUIZ ATTEMPTS:",
                attempts
            );


            // =================================================
            // NEXT ATTEMPT CHECK
            // =================================================

            const maxAttempts =
                Number(
                    quizData.maxAttempts ?? 1
                );

            const hasAvailableAttempt =
                attempts.length <
                maxAttempts;

            setCanAttemptAgain(
                hasAvailableAttempt
            );


            // =================================================
            // NO ATTEMPT
            // =================================================

            if (attempts.length === 0) {

                console.log(
                    "NO ATTEMPT FOUND - STARTING QUIZ"
                );

                const response =
                    await QuizAttemptService
                        .startQuiz(
                            studentId,
                            numericQuizId
                        );

                const data =
                    getResponseData(response);

                const newAttempt =
                    normalizeAttempt(data);

                if (!newAttempt) {

                    throw new Error(
                        "Backend did not return a valid quiz attempt."
                    );
                }

                setAttemptId(
                    newAttempt.id
                );

                setAttemptStatus(
                    newAttempt.status ||
                    "IN_PROGRESS"
                );

                setScore(
                    newAttempt.score || 0
                );

                setTotalMarks(
                    newAttempt.totalMarks ||
                    quizTotalMarks
                );

                setQuizCompleted(false);

                setCanAttemptAgain(false);

                startTimer(
                    quizData,
                    newAttempt
                );

                return;
            }


            // =================================================
            // GET LATEST ATTEMPT
            // =================================================

            const sortedAttempts =
                [...attempts].sort(
                    (a, b) =>
                        Number(a.id) -
                        Number(b.id)
                );

            const latestAttempt =
                sortedAttempts[
                    sortedAttempts.length - 1
                ];


            console.log(
                "LATEST ATTEMPT:",
                latestAttempt
            );


            // =================================================
            // SET CURRENT ATTEMPT
            // =================================================

            setAttemptId(
                latestAttempt.id
            );

            setScore(
                latestAttempt.score
            );

            setTotalMarks(
                latestAttempt.totalMarks ||
                quizTotalMarks
            );

            setAttemptStatus(
                latestAttempt.status
            );


            // =================================================
            // COMPLETED
            // =================================================

            if (
                latestAttempt.status ===
                "COMPLETED"
            ) {

                console.log(
                    "LATEST ATTEMPT COMPLETED"
                );

                setQuizCompleted(true);

                await checkNextAttemptAvailability(
                    studentId,
                    numericQuizId,
                    quizData
                );

                return;
            }


            // =================================================
            // IN PROGRESS
            // =================================================

            if (
                latestAttempt.status ===
                "IN_PROGRESS"
            ) {

                console.log(
                    "RESUMING ATTEMPT:",
                    latestAttempt.id
                );

                await loadSavedAnswers(
                    latestAttempt.id
                );

                setQuizCompleted(false);

                startTimer(
                    quizData,
                    latestAttempt
                );

                return;
            }


            // =================================================
            // UNKNOWN STATUS
            // =================================================

            console.warn(
                "Unknown attempt status:",
                latestAttempt.status
            );

        } catch (err) {

            console.error(
                "Unable to load quiz:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Unable to load quiz.";

            setError(message);

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // TIMER
    // ========================================================

    const startTimer = (
        quizData,
        attempt
    ) => {

        if (!quizData) {
            return;
        }

        const duration =
            Number(
                quizData.durationMinutes
            );

        if (
            !duration ||
            duration <= 0
        ) {

            setTimeLeft(null);

            return;
        }


        if (attempt?.startedAt) {

            const start =
                new Date(
                    attempt.startedAt
                );

            if (
                !Number.isNaN(
                    start.getTime()
                )
            ) {

                const end =
                    start.getTime() +
                    duration *
                    60 *
                    1000;

                const remaining =
                    Math.max(
                        0,
                        Math.floor(
                            (
                                end -
                                Date.now()
                            ) / 1000
                        )
                    );

                setTimeLeft(
                    remaining
                );

                return;
            }
        }

        setTimeLeft(
            duration * 60
        );
    };


    // ========================================================
    // INITIAL LOAD
    // ========================================================

    useEffect(() => {

        loadQuiz();

        // eslint-disable-next-line
    }, [quizId]);


    // ========================================================
    // TIMER EFFECT
    // ========================================================

    useEffect(() => {

        if (
            quizCompleted ||
            timeLeft === null ||
            timeLeft <= 0
        ) {

            return;
        }

        const timer =
            setInterval(() => {

                setTimeLeft(
                    previous => {

                        if (
                            previous === null ||
                            previous <= 1
                        ) {

                            clearInterval(
                                timer
                            );

                            return 0;
                        }

                        return previous - 1;
                    }
                );

            }, 1000);

        return () => {

            clearInterval(
                timer
            );
        };

    }, [
        quizCompleted,
        timeLeft
    ]);


    // ========================================================
    // AUTO SUBMIT
    // ========================================================

    useEffect(() => {

        if (
            timeLeft === 0 &&
            !quizCompleted &&
            attemptId &&
            !submitting
        ) {

            handleSubmitQuiz(true);
        }

        // eslint-disable-next-line
    }, [timeLeft]);


    // ========================================================
    // FORMAT TIME
    // ========================================================

    const formatTime = (seconds) => {

        if (
            seconds === null ||
            seconds === undefined
        ) {

            return "--:--";
        }

        const minutes =
            Math.floor(
                seconds / 60
            );

        const remainingSeconds =
            seconds % 60;

        return (
            String(minutes).padStart(
                2,
                "0"
            ) +
            ":" +
            String(
                remainingSeconds
            ).padStart(
                2,
                "0"
            )
        );
    };


    // ========================================================
    // GET QUESTION ID
    // ========================================================

    const getQuestionId = (
        question
    ) => {

        return (
            question.id ??
            question.questionId
        );
    };


    // ========================================================
    // GET OPTIONS
    // ========================================================

    const getOptions = (
        question
    ) => {

        if (
            Array.isArray(
                question.options
            )
        ) {

            return question.options;
        }

        if (
            Array.isArray(
                question.choices
            )
        ) {

            return question.choices;
        }

        const options = [];


        if (
            question.optionA !== null &&
            question.optionA !== undefined
        ) {

            options.push({
                label: "A",
                value: question.optionA
            });
        }


        if (
            question.optionB !== null &&
            question.optionB !== undefined
        ) {

            options.push({
                label: "B",
                value: question.optionB
            });
        }


        if (
            question.optionC !== null &&
            question.optionC !== undefined
        ) {

            options.push({
                label: "C",
                value: question.optionC
            });
        }


        if (
            question.optionD !== null &&
            question.optionD !== undefined
        ) {

            options.push({
                label: "D",
                value: question.optionD
            });
        }

        return options;
    };


    // ========================================================
    // ANSWER CHANGE
    // ========================================================

    /*
     * IMPORTANT FIX
     *
     * Question.correctAnswer is stored as:
     *
     * A
     * B
     * C
     * D
     *
     * Therefore we MUST save the option LABEL,
     * not the option text.
     *
     * Example:
     *
     * A. Paris
     *
     * Save:
     * A
     *
     * NOT:
     * Paris
     */

    const handleAnswerChange = async (
        question,
        selectedValue,
        selectedLabel
    ) => {

        if (
            quizCompleted ||
            !attemptId
        ) {

            return;
        }

        const questionId =
            getQuestionId(question);

        if (!questionId) {

            console.error(
                "Question ID missing:",
                question
            );

            return;
        }


        // ====================================================
        // SAVE A / B / C / D
        // ====================================================

        const answerToSave =
            String(
                selectedLabel
            ).trim().toUpperCase();


        console.log(
            "ANSWER SELECTED:",
            {
                questionId,
                selectedValue,
                selectedLabel,
                answerToSave
            }
        );


        // ====================================================
        // UPDATE SCREEN
        // ====================================================

        setAnswers(
            previous => ({
                ...previous,

                [String(questionId)]:
                    answerToSave
            })
        );


        // ====================================================
        // SAVE TO DATABASE
        // ====================================================

        try {

            await StudentAnswerService
                .saveAnswer(
                    attemptId,
                    questionId,
                    answerToSave
                );

        } catch (err) {

            console.error(
                "Unable to save answer:",
                err
            );
        }
    };


    // ========================================================
    // SUBMIT QUIZ
    // ========================================================

    const handleSubmitQuiz = async (
        autoSubmit = false
    ) => {

        if (submitting) {
            return;
        }

        if (!attemptId) {

            alert(
                "Quiz attempt ID is missing."
            );

            return;
        }

        if (quizCompleted) {
            return;
        }


        if (!autoSubmit) {

            const confirmed =
                window.confirm(
                    "Are you sure you want to submit the quiz?"
                );

            if (!confirmed) {
                return;
            }
        }


        setSubmitting(true);


        try {

            const response =
                await QuizAttemptService
                    .submitQuiz(
                        attemptId
                    );

            const data =
                getResponseData(response);

            const completedAttempt =
                normalizeAttempt(data);

            if (!completedAttempt) {

                throw new Error(
                    "Backend did not return a completed attempt."
                );
            }


            console.log(
                "QUIZ COMPLETED:",
                completedAttempt
            );


            // =================================================
            // UPDATE RESULT
            // =================================================

            setAttemptId(
                completedAttempt.id
            );

            setScore(
                completedAttempt.score
            );

            setTotalMarks(
                completedAttempt.totalMarks ||
                quiz?.totalMarks ||
                0
            );

            setAttemptStatus(
                completedAttempt.status ||
                "COMPLETED"
            );

            setQuizCompleted(true);

            setTimeLeft(0);


            // =================================================
            // CHECK NEXT ATTEMPT
            // =================================================

            const studentId =
                getStudentId();

            if (studentId && quiz) {

                await checkNextAttemptAvailability(
                    studentId,
                    Number(quizId),
                    quiz
                );
            }

        } catch (err) {

            console.error(
                "Failed to submit quiz:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.message ||
                "Failed to submit quiz.";

            alert(message);

        } finally {

            setSubmitting(false);
        }
    };


    // ========================================================
    // ANSWERED COUNT
    // ========================================================

    const answeredCount =
        useMemo(() => {

            return Object.values(
                answers
            ).filter(
                value =>
                    value !== null &&
                    value !== undefined &&
                    String(value).trim() !== ""
            ).length;

        }, [answers]);


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (

            <div
                style={{
                    padding: "40px",
                    textAlign: "center"
                }}
            >

                <h2>
                    Loading Quiz...
                </h2>

            </div>
        );
    }


    // ========================================================
    // ERROR
    // ========================================================

    if (error) {

        return (

            <div
                style={{
                    maxWidth: "900px",
                    margin: "40px auto",
                    padding: "30px"
                }}
            >

                <div
                    style={{
                        background: "#f8d7da",
                        border:
                            "1px solid #f5c2c7",
                        borderRadius: "6px",
                        padding: "25px",
                        color: "#842029"
                    }}
                >

                    <h2>
                        Unable to Start Quiz
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/quizzes"
                            )
                        }
                        style={{
                            background: "#0d6efd",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            padding: "12px 20px",
                            cursor: "pointer",
                            fontSize: "16px"
                        }}
                    >
                        Back to Quizzes
                    </button>

                </div>

            </div>
        );
    }


    // ========================================================
    // COMPLETED SCREEN
    // ========================================================

    if (quizCompleted) {

        const displayTotal =
            totalMarks ||
            quiz?.totalMarks ||
            0;

        const displayScore =
            score ?? 0;

        return (

            <div
                style={{
                    maxWidth: "900px",
                    margin: "40px auto",
                    padding: "0 20px"
                }}
            >

                <div
                    style={{
                        background: "#fff",
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow:
                            "0 4px 15px rgba(0,0,0,0.12)"
                    }}
                >

                    {/* HEADER */}

                    <div
                        style={{
                            background: "#198754",
                            color: "#fff",
                            padding: "20px 30px"
                        }}
                    >

                        <h1
                            style={{
                                margin: 0
                            }}
                        >
                            Quiz Completed
                        </h1>

                    </div>


                    {/* RESULT */}

                    <div
                        style={{
                            padding: "35px",
                            textAlign: "center"
                        }}
                    >

                        <h2
                            style={{
                                fontSize: "36px",
                                marginBottom: "25px"
                            }}
                        >
                            {quiz?.title}
                        </h2>


                        <div
                            style={{
                                fontSize: "52px",
                                fontWeight: "bold",
                                color: "#333"
                            }}
                        >

                            {displayScore}
                            /
                            {displayTotal}

                        </div>


                        <p
                            style={{
                                fontSize: "18px",
                                color: "#666",
                                marginTop: "10px"
                            }}
                        >
                            Your Score
                        </p>


                        {/* STATUS */}

                        <div
                            style={{
                                marginTop: "30px",
                                fontSize: "18px"
                            }}
                        >

                            <strong>
                                Status:
                            </strong>

                            <span
                                style={{
                                    display:
                                        "inline-block",
                                    marginLeft: "10px",
                                    background:
                                        "#198754",
                                    color: "#fff",
                                    padding:
                                        "6px 12px",
                                    borderRadius: "5px",
                                    fontWeight: "bold"
                                }}
                            >
                                {attemptStatus ||
                                    "COMPLETED"}
                            </span>

                        </div>


                        {/* BUTTONS */}

                        <div
                            style={{
                                marginTop: "35px",
                                display: "flex",
                                justifyContent:
                                    "center",
                                gap: "12px",
                                flexWrap: "wrap"
                            }}
                        >

                            {/* BACK */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/quizzes"
                                    )
                                }
                                style={{
                                    background:
                                        "#0d6efd",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    padding:
                                        "12px 24px",
                                    cursor: "pointer",
                                    fontSize: "16px"
                                }}
                            >
                                Back to Quizzes
                            </button>


                            {/* NEXT ATTEMPT */}

                            {canAttemptAgain && (

                                <button
                                    type="button"
                                    onClick={
                                        handleNextAttempt
                                    }
                                    disabled={loading}
                                    style={{
                                        background:
                                            "#198754",
                                        color: "#fff",
                                        border: "none",
                                        borderRadius: "5px",
                                        padding:
                                            "12px 24px",
                                        cursor:
                                            loading
                                                ? "not-allowed"
                                                : "pointer",
                                        fontSize: "16px",
                                        opacity:
                                            loading
                                                ? 0.7
                                                : 1
                                    }}
                                >

                                    {loading
                                        ? "Starting..."
                                        : "Next Attempt"}

                                </button>

                            )}

                        </div>


                        {/* ATTEMPT INFORMATION */}

                        <div
                            style={{
                                marginTop: "25px",
                                color: "#666"
                            }}
                        >

                            <strong>
                                Attempts:
                            </strong>{" "}

                            {canAttemptAgain
                                ? "Another attempt is available."
                                : "No more attempts available."}

                        </div>

                    </div>

                </div>

            </div>
        );
    }


    // ========================================================
    // QUIZ PAGE
    // ========================================================

    return (

        <div
            style={{
                maxWidth: "900px",
                margin: "30px auto",
                padding: "0 20px"
            }}
        >

            {/* =================================================
                QUIZ HEADER
            ================================================= */}

            <div
                style={{
                    background: "#0d6efd",
                    color: "#fff",
                    borderRadius: "8px",
                    padding: "25px",
                    marginBottom: "20px"
                }}
            >

                <h1
                    style={{
                        marginTop: 0
                    }}
                >
                    {quiz?.title}
                </h1>


                {quiz?.description && (

                    <p>
                        {quiz.description}
                    </p>

                )}


                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        flexWrap: "wrap",
                        gap: "15px"
                    }}
                >

                    <span>
                        Total Marks:{" "}
                        <strong>
                            {quiz?.totalMarks ?? 0}
                        </strong>
                    </span>


                    <span>
                        Max Attempts:{" "}
                        <strong>
                            {quiz?.maxAttempts ?? 1}
                        </strong>
                    </span>


                    <span>
                        Questions:{" "}
                        <strong>
                            {questions.length}
                        </strong>
                    </span>


                    <span>
                        Answered:{" "}
                        <strong>
                            {answeredCount}
                        </strong>
                    </span>


                    {timeLeft !== null && (

                        <span
                            style={{
                                fontWeight: "bold",
                                background:
                                    timeLeft <= 60
                                        ? "#dc3545"
                                        : "#198754",
                                padding:
                                    "6px 12px",
                                borderRadius: "5px"
                            }}
                        >
                            Time:{" "}
                            {formatTime(
                                timeLeft
                            )}
                        </span>

                    )}

                </div>

            </div>


            {/* =================================================
                QUESTIONS
            ================================================= */}

            {questions.length === 0 ? (

                <div
                    style={{
                        background: "#fff3cd",
                        border:
                            "1px solid #ffecb5",
                        padding: "20px",
                        borderRadius: "6px"
                    }}
                >

                    No questions found
                    for this quiz.

                </div>

            ) : (

                questions.map(
                    (
                        question,
                        index
                    ) => {

                        const questionId =
                            getQuestionId(
                                question
                            );

                        const selected =
                            answers[
                                String(
                                    questionId
                                )
                            ];

                        const options =
                            getOptions(
                                question
                            );


                        return (

                            <div
                                key={
                                    questionId ??
                                    index
                                }
                                style={{
                                    background:
                                        "#fff",
                                    border:
                                        "1px solid #ddd",
                                    borderRadius:
                                        "8px",
                                    padding:
                                        "25px",
                                    marginBottom:
                                        "20px",
                                    boxShadow:
                                        "0 2px 6px rgba(0,0,0,0.06)"
                                }}
                            >

                                {/* QUESTION */}

                                <h2
                                    style={{
                                        marginTop: 0,
                                        fontSize:
                                            "22px"
                                    }}
                                >

                                    {index + 1}.
                                    {" "}

                                    {question.questionText ??
                                        question.question ??
                                        question.content ??
                                        question.text ??
                                        "Question"}

                                </h2>


                                {/* MARKS */}

                                {question.marks !==
                                    undefined &&
                                    question.marks !==
                                    null && (

                                        <p
                                            style={{
                                                color:
                                                    "#666"
                                            }}
                                        >
                                            Marks:{" "}
                                            {
                                                question.marks
                                            }
                                        </p>

                                    )}


                                {/* OPTIONS */}

                                {options.length > 0 ? (

                                    <div>

                                        {options.map(
                                            (
                                                option,
                                                optionIndex
                                            ) => {

                                                const value =
                                                    typeof option ===
                                                        "string"
                                                        ? option
                                                        : option.value ??
                                                        option.text ??
                                                        option.label;

                                                const label =
                                                    typeof option ===
                                                        "string"
                                                        ? String.fromCharCode(
                                                            65 +
                                                            optionIndex
                                                        )
                                                        : option.label ??
                                                        String.fromCharCode(
                                                            65 +
                                                            optionIndex
                                                        );

                                                return (

                                                    <label
                                                        key={
                                                            optionIndex
                                                        }
                                                        style={{
                                                            display:
                                                                "block",
                                                            border:
                                                                "1px solid #ddd",
                                                            borderRadius:
                                                                "6px",
                                                            padding:
                                                                "15px",
                                                            marginBottom:
                                                                "10px",
                                                            cursor:
                                                                "pointer",
                                                            background:
                                                                selected ===
                                                                    label
                                                                    ? "#e7f1ff"
                                                                    : "#fff"
                                                        }}
                                                    >

                                                        <input
                                                            type="radio"
                                                            name={
                                                                `question-${questionId}`
                                                            }

                                                            /*
                                                             * IMPORTANT:
                                                             *
                                                             * The radio value is
                                                             * now A/B/C/D.
                                                             */
                                                            value={
                                                                label
                                                            }

                                                            checked={
                                                                selected ===
                                                                label
                                                            }

                                                            disabled={
                                                                !attemptId ||
                                                                submitting
                                                            }

                                                            onChange={() =>
                                                                handleAnswerChange(
                                                                    question,
                                                                    value,
                                                                    label
                                                                )
                                                            }

                                                            style={{
                                                                marginRight:
                                                                    "10px"
                                                            }}
                                                        />


                                                        <strong>
                                                            {label}.
                                                        </strong>

                                                        {" "}

                                                        {value}

                                                    </label>

                                                );
                                            }
                                        )}

                                    </div>

                                ) : (

                                    <input
                                        type="text"
                                        value={
                                            selected ??
                                            ""
                                        }
                                        disabled={
                                            !attemptId ||
                                            submitting
                                        }
                                        onChange={
                                            event =>
                                                handleAnswerChange(
                                                    question,
                                                    event.target.value,
                                                    event.target.value
                                                )
                                        }
                                        placeholder=
                                            "Enter your answer"
                                        style={{
                                            width:
                                                "100%",
                                            boxSizing:
                                                "border-box",
                                            padding:
                                                "12px",
                                            border:
                                                "1px solid #ccc",
                                            borderRadius:
                                                "5px",
                                            fontSize:
                                                "16px"
                                        }}
                                    />

                                )}

                            </div>

                        );
                    }
                )

            )}


            {/* =================================================
                SUBMIT
            ================================================= */}

            {questions.length > 0 && (

                <div
                    style={{
                        textAlign: "center",
                        padding:
                            "20px 0 50px"
                    }}
                >

                    <button
                        type="button"
                        onClick={() =>
                            handleSubmitQuiz(
                                false
                            )
                        }
                        disabled={
                            submitting ||
                            !attemptId ||
                            quizCompleted
                        }
                        style={{
                            background:
                                submitting
                                    ? "#6c757d"
                                    : "#198754",
                            color: "#fff",
                            border: "none",
                            borderRadius: "6px",
                            padding:
                                "15px 35px",
                            fontSize: "18px",
                            cursor:
                                submitting ||
                                !attemptId
                                    ? "not-allowed"
                                    : "pointer",
                            opacity:
                                submitting ||
                                !attemptId
                                    ? 0.7
                                    : 1
                        }}
                    >

                        {submitting
                            ? "Submitting..."
                            : "Submit Quiz"}

                    </button>

                </div>

            )}

        </div>
    );
}


export default AttendQuiz;