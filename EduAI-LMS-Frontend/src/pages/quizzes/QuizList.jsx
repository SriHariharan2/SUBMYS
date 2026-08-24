import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import QuizService from "../../services/QuizService";
import QuizAttemptService from "../../services/QuizAttemptService";
import EnrollmentService from "../../services/EnrollmentService";

import { getUser } from "../../utils/localStorage";


// ============================================================
// QUIZ LIST
// ============================================================

function QuizList() {

    // ========================================================
    // QUIZZES
    // ========================================================

    const [quizzes, setQuizzes] = useState([]);

    // Course IDs assigned to the logged-in student
    const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);


    // ========================================================
    // STUDENT ATTEMPTS
    // ========================================================

    const [studentAttempts, setStudentAttempts] = useState([]);


    // ========================================================
    // LOADING
    // ========================================================

    const [loading, setLoading] = useState(true);

    const [attemptsLoading, setAttemptsLoading] =
        useState(false);


    // ========================================================
    // FILTERS
    // ========================================================

    const [search, setSearch] = useState("");

    const [topicFilter, setTopicFilter] =
        useState("");

    const [durationFilter, setDurationFilter] =
        useState("");

    const [marksFilter, setMarksFilter] =
        useState("");

    const [sortBy, setSortBy] =
        useState("TITLE");


    // ========================================================
    // LOGGED-IN USER
    // ========================================================

    const user = getUser();

    const studentId =
        user?.id ??
        user?.userId ??
        user?.studentId ??
        null;

    const role =
        String(user?.role ?? "").toUpperCase();

    const isStudent =
        role === "STUDENT";

    const isAdmin =
        role === "ADMIN";

    const isTeacher =
        role === "TEACHER";


    // ========================================================
    // LOAD DATA
    // ========================================================

    useEffect(() => {

        if (isStudent && studentId) {
            loadStudentCourseIds();
            loadStudentAttempts();
        } else {
            loadQuizzes();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);


    // ========================================================
    // LOAD STUDENT ENROLLED COURSE IDS
    // ========================================================

    const loadStudentCourseIds = async () => {

        if (!studentId) {
            setEnrolledCourseIds([]);
            setQuizzes([]);
            setLoading(false);
            return;
        }

        try {

            setLoading(true);

            const response =
                await EnrollmentService.getStudentCourseIds(
                    studentId
                );

            const data = Array.isArray(response.data)
                ? response.data
                : [];

            const courseIds = data
                .map((id) => Number(id))
                .filter((id) => Number.isFinite(id));

            console.log(
                "Student enrolled course IDs:",
                courseIds
            );

            setEnrolledCourseIds(courseIds);

            // Get quizzes and filter them to enrolled courses.
            await loadQuizzes(courseIds);

        } catch (error) {

            console.error(
                "Unable to load enrolled courses:",
                error
            );

            setEnrolledCourseIds([]);
            setQuizzes([]);

            alert(
                "Unable to load your enrolled courses."
            );

            setLoading(false);
        }
    };


    // ========================================================
    // LOAD QUIZZES
    // ========================================================

    const loadQuizzes = async (studentCourseIds = null) => {

        try {

            setLoading(true);

            const response =
                await QuizService.getAllQuizzes();

            console.log(
                "Quiz API Response:",
                response.data
            );

            let data = response.data;

            // Normal array
            if (Array.isArray(data)) {

                if (isStudent) {

                    const allowedCourseIds =
                        studentCourseIds ?? enrolledCourseIds;

                    const filteredData =
                        data.filter((quiz) => {

                            const courseId =
                                quiz?.courseId ??
                                quiz?.topic?.subject?.course?.id ??
                                quiz?.topic?.courseId;

                            return (
                                courseId != null &&
                                allowedCourseIds.includes(
                                    Number(courseId)
                                )
                            );
                        });

                    console.log(
                        "Student quizzes after enrollment filter:",
                        filteredData
                    );

                    setQuizzes(filteredData);

                } else {

                    setQuizzes(data);
                }

                return;
            }

            // Paginated response
            if (
                Array.isArray(data?.content)
            ) {

                const quizData = data.content;

                if (isStudent) {

                    const allowedCourseIds =
                        studentCourseIds ?? enrolledCourseIds;

                    const filteredData =
                        quizData.filter((quiz) => {

                            const courseId =
                                quiz?.courseId ??
                                quiz?.topic?.subject?.course?.id ??
                                quiz?.topic?.courseId;

                            return (
                                courseId != null &&
                                allowedCourseIds.includes(
                                    Number(courseId)
                                )
                            );
                        });

                    setQuizzes(filteredData);

                } else {

                    setQuizzes(quizData);
                }

                return;
            }

            setQuizzes([]);

        } catch (error) {

            console.error(
                "Unable to load quizzes:",
                error
            );

            setQuizzes([]);

            alert(
                "Unable to load quizzes."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================================
    // LOAD STUDENT ATTEMPTS
    // ========================================================

    const loadStudentAttempts = async () => {

        if (!studentId) {

            setStudentAttempts([]);

            return;
        }

        try {

            setAttemptsLoading(true);

            console.log(
                "Loading attempts for student:",
                studentId
            );

            const response =
                await QuizAttemptService
                    .getAttemptsByStudent(
                        studentId
                    );

            console.log(
                "Student Attempts:",
                response.data
            );

            let data =
                response.data;

            // Paginated response

            if (
                !Array.isArray(data) &&
                Array.isArray(data?.content)
            ) {

                data =
                    data.content;
            }

            if (Array.isArray(data)) {

                setStudentAttempts(data);

            } else {

                setStudentAttempts([]);
            }

        } catch (error) {

            console.error(
                "Unable to load student attempts:",
                error
            );

            setStudentAttempts([]);

        } finally {

            setAttemptsLoading(false);
        }
    };


    // ========================================================
    // GET ATTEMPTS FOR QUIZ
    // ========================================================

    const getQuizAttempts = (quizId) => {

        return studentAttempts.filter(
            (attempt) => {

                const attemptQuizId =
                    attempt?.quizId ??
                    attempt?.quiz?.id;

                return (
                    Number(attemptQuizId) ===
                    Number(quizId)
                );
            }
        );
    };


    // ========================================================
    // GET MAX ATTEMPTS
    // ========================================================

    const getMaxAttempts = (quiz) => {

        const value =
            Number(
                quiz?.maxAttempts
            );

        if (
            !Number.isFinite(value) ||
            value < 1
        ) {

            return 1;
        }

        return value;
    };


    // ========================================================
    // GET ATTEMPT COUNT
    // ========================================================

    const getAttemptCount = (quiz) => {

        return getQuizAttempts(
            quiz?.id
        ).length;
    };


    // ========================================================
    // GET LATEST ATTEMPT
    // ========================================================

    const getLatestAttempt = (quiz) => {

        const attempts =
            getQuizAttempts(
                quiz?.id
            );

        if (attempts.length === 0) {

            return null;
        }

        const sorted =
            [...attempts].sort(
                (a, b) => {

                    const dateA =
                        a?.startedAt
                            ? new Date(
                                a.startedAt
                            ).getTime()
                            : 0;

                    const dateB =
                        b?.startedAt
                            ? new Date(
                                b.startedAt
                            ).getTime()
                            : 0;

                    return dateB - dateA;
                }
            );

        return sorted[0];
    };


    // ========================================================
    // GET QUIZ STATUS
    // ========================================================

    const getQuizStatus = (quiz) => {

        const attempts =
            getQuizAttempts(
                quiz?.id
            );


        // ----------------------------------------------------
        // NOT ATTEMPTED
        // ----------------------------------------------------

        if (attempts.length === 0) {

            return {

                text: "NOT ATTEMPTED",

                className: "bg-secondary",

                type: "NOT_ATTEMPTED"
            };
        }


        // ----------------------------------------------------
        // IN PROGRESS
        // ----------------------------------------------------

        const inProgress =
            attempts.find(
                (attempt) =>
                    String(
                        attempt?.status
                    ).toUpperCase() ===
                    "IN_PROGRESS"
            );

        if (inProgress) {

            return {

                text: "IN PROGRESS",

                className:
                    "bg-warning text-dark",

                type: "IN_PROGRESS"
            };
        }


        // ----------------------------------------------------
        // MAX ATTEMPTS
        // ----------------------------------------------------

        const maxAttempts =
            getMaxAttempts(quiz);

        if (
            attempts.length >=
            maxAttempts
        ) {

            return {

                text: "COMPLETED",

                className: "bg-success",

                type: "COMPLETED"
            };
        }


        // ----------------------------------------------------
        // ATTEMPTED BUT REMAINING
        // ----------------------------------------------------

        return {

            text:
                `ATTEMPTED ${attempts.length}/${maxAttempts}`,

            className:
                "bg-info text-dark",

            type: "ATTEMPTED"
        };
    };


    // ========================================================
    // CAN ATTEMPT QUIZ
    // ========================================================

    const canAttemptQuiz = (quiz) => {

        const attempts =
            getQuizAttempts(
                quiz?.id
            );

        const maxAttempts =
            getMaxAttempts(quiz);


        // ----------------------------------------------------
        // IN PROGRESS CAN ALWAYS RESUME
        // ----------------------------------------------------

        const inProgress =
            attempts.some(
                (attempt) =>
                    String(
                        attempt?.status
                    ).toUpperCase() ===
                    "IN_PROGRESS"
            );

        if (inProgress) {

            return true;
        }


        // ----------------------------------------------------
        // CHECK MAXIMUM
        // ----------------------------------------------------

        return (
            attempts.length <
            maxAttempts
        );
    };


    // ========================================================
    // BUTTON TEXT
    // ========================================================

    const getButtonText = (quiz) => {

        const attempts =
            getQuizAttempts(
                quiz?.id
            );

        const inProgress =
            attempts.some(
                (attempt) =>
                    String(
                        attempt?.status
                    ).toUpperCase() ===
                    "IN_PROGRESS"
            );

        if (inProgress) {

            return "Continue Quiz";
        }

        const maxAttempts =
            getMaxAttempts(quiz);

        if (
            attempts.length >=
            maxAttempts
        ) {

            return "Attempts Finished";
        }

        return "Start Quiz";
    };


    // ========================================================
    // DELETE QUIZ
    // ========================================================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this quiz?"
            );

        if (!confirmed) {

            return;
        }

        try {

            await QuizService.deleteQuiz(id);

            alert(
                "Quiz deleted successfully."
            );

            await loadQuizzes();

        } catch (error) {

            console.error(
                "Delete quiz error:",
                error
            );

            alert(
                "Unable to delete quiz."
            );
        }
    };


    // ========================================================
    // RESET FILTERS
    // ========================================================

    const resetFilters = () => {

        setSearch("");

        setTopicFilter("");

        setDurationFilter("");

        setMarksFilter("");

        setSortBy("TITLE");
    };


    // ========================================================
    // FILTER + SORT
    // ========================================================

    const filteredQuizzes =
        [...quizzes]

            .filter(
                (quiz) => {

                    // SEARCH

                    const title =
                        String(
                            quiz?.title ?? ""
                        );

                    const description =
                        String(
                            quiz?.description ?? ""
                        );

                    const searchText =
                        search.toLowerCase();

                    const searchMatch =
                        title
                            .toLowerCase()
                            .includes(searchText) ||
                        description
                            .toLowerCase()
                            .includes(searchText);


                    // TOPIC

                    const topicId =
                        quiz?.topic?.id ??
                        quiz?.topicId;

                    const topicMatch =
                        topicFilter === "" ||
                        Number(topicId) ===
                        Number(topicFilter);


                    // DURATION

                    const duration =
                        Number(
                            quiz?.durationMinutes ??
                            0
                        );

                    let durationMatch = true;

                    if (
                        durationFilter ===
                        "SHORT"
                    ) {

                        durationMatch =
                            duration <= 30;
                    }

                    if (
                        durationFilter ===
                        "MEDIUM"
                    ) {

                        durationMatch =
                            duration > 30 &&
                            duration <= 60;
                    }

                    if (
                        durationFilter ===
                        "LONG"
                    ) {

                        durationMatch =
                            duration > 60;
                    }


                    // MARKS

                    const marks =
                        Number(
                            quiz?.totalMarks ??
                            0
                        );

                    let marksMatch = true;

                    if (
                        marksFilter ===
                        "25"
                    ) {

                        marksMatch =
                            marks <= 25;
                    }

                    if (
                        marksFilter ===
                        "50"
                    ) {

                        marksMatch =
                            marks > 25 &&
                            marks <= 50;
                    }

                    if (
                        marksFilter ===
                        "100"
                    ) {

                        marksMatch =
                            marks > 50;
                    }

                    return (
                        searchMatch &&
                        topicMatch &&
                        durationMatch &&
                        marksMatch
                    );
                }
            )

            .sort(
                (a, b) => {

                    switch (sortBy) {

                        case "TITLE":

                            return String(
                                a?.title ?? ""
                            ).localeCompare(
                                String(
                                    b?.title ?? ""
                                )
                            );


                        case "MARKS":

                            return (
                                Number(
                                    a?.totalMarks ?? 0
                                ) -
                                Number(
                                    b?.totalMarks ?? 0
                                )
                            );


                        case "DURATION":

                            return (
                                Number(
                                    a?.durationMinutes ?? 0
                                ) -
                                Number(
                                    b?.durationMinutes ?? 0
                                )
                            );


                        default:

                            return 0;
                    }
                }
            );


    // ========================================================
    // GET UNIQUE TOPICS
    // ========================================================

    const topics = [
        ...new Map(
            quizzes
                .filter(
                    (quiz) =>
                        quiz?.topic
                )
                .map(
                    (quiz) => [
                        quiz.topic.id,
                        quiz.topic
                    ]
                )
        ).values()
    ];


    // ========================================================
    // UI
    // ========================================================

    return (

        <DashboardLayout>

            <div className="container mt-4">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="
                        d-flex
                        justify-content-between
                        align-items-center
                        mb-3
                    "
                >

                    <h2>
                        Quiz List
                    </h2>


                    {/* ADMIN / TEACHER ADD QUIZ */}

                    {(isAdmin ||
                        isTeacher) && (

                        <Link
                            to="/quizzes/add"
                            className="
                                btn
                                btn-success
                            "
                        >
                            Add Quiz
                        </Link>

                    )}

                </div>


                {/* ==================================================
                    CARD
                ================================================== */}

                <div className="card shadow">

                    <div className="card-body">


                        {/* ==================================================
                            SEARCH
                        ================================================== */}

                        <div className="mb-3">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search Quiz..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* ==================================================
                            FILTER ROW
                        ================================================== */}

                        <div className="row mb-3">

                            {/* TOPIC */}

                            <div className="col-md-3">

                                <label className="form-label">
                                    Topic
                                </label>

                                <select
                                    className="form-select"
                                    value={topicFilter}
                                    onChange={(e) =>
                                        setTopicFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        All Topics
                                    </option>

                                    {topics.map(
                                        (topic) => (

                                            <option
                                                key={
                                                    topic.id
                                                }
                                                value={
                                                    topic.id
                                                }
                                            >
                                                {
                                                    topic.title
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* DURATION */}

                            <div className="col-md-2">

                                <label className="form-label">
                                    Duration
                                </label>

                                <select
                                    className="form-select"
                                    value={durationFilter}
                                    onChange={(e) =>
                                        setDurationFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        All
                                    </option>

                                    <option value="SHORT">
                                        ≤ 30 mins
                                    </option>

                                    <option value="MEDIUM">
                                        31 - 60 mins
                                    </option>

                                    <option value="LONG">
                                        60+ mins
                                    </option>

                                </select>

                            </div>


                            {/* MARKS */}

                            <div className="col-md-2">

                                <label className="form-label">
                                    Total Marks
                                </label>

                                <select
                                    className="form-select"
                                    value={marksFilter}
                                    onChange={(e) =>
                                        setMarksFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        All
                                    </option>

                                    <option value="25">
                                        ≤ 25
                                    </option>

                                    <option value="50">
                                        26 - 50
                                    </option>

                                    <option value="100">
                                        50+
                                    </option>

                                </select>

                            </div>


                            {/* SORT */}

                            <div className="col-md-3">

                                <label className="form-label">
                                    Sort By
                                </label>

                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={(e) =>
                                        setSortBy(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="TITLE">
                                        Title
                                    </option>

                                    <option value="MARKS">
                                        Total Marks
                                    </option>

                                    <option value="DURATION">
                                        Duration
                                    </option>

                                </select>

                            </div>


                            {/* RESET */}

                            <div
                                className="
                                    col-md-2
                                    d-flex
                                    align-items-end
                                "
                            >

                                <button
                                    type="button"
                                    className="
                                        btn
                                        btn-secondary
                                        w-100
                                    "
                                    onClick={
                                        resetFilters
                                    }
                                >
                                    Reset
                                </button>

                            </div>

                        </div>


                        {/* ==================================================
                            ATTEMPT LOADING
                        ================================================== */}

                        {isStudent &&
                            attemptsLoading && (

                            <div
                                className="
                                    alert
                                    alert-info
                                "
                            >
                                Loading your quiz attempts...
                            </div>

                        )}


                        {/* ==================================================
                            TABLE
                        ================================================== */}

                        <div className="table-responsive">

                            <table
                                className="
                                    table
                                    table-bordered
                                    table-hover
                                    align-middle
                                "
                            >

                                <thead
                                    className="table-dark"
                                >

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Title
                                        </th>

                                        <th>
                                            Description
                                        </th>

                                        <th>
                                            Total Marks
                                        </th>

                                        <th>
                                            Duration
                                        </th>

                                        <th>
                                            Max Attempts
                                        </th>

                                        {isStudent && (

                                            <>

                                                <th>
                                                    Attempts
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th>
                                                    Score
                                                </th>

                                            </>

                                        )}

                                        <th>
                                            Topic
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>


                                    {/* LOADING */}

                                    {loading && (

                                        <tr>

                                            <td
                                                colSpan={
                                                    isStudent
                                                        ? 11
                                                        : 8
                                                }
                                                className="
                                                    text-center
                                                "
                                            >
                                                Loading quizzes...
                                            </td>

                                        </tr>

                                    )}


                                    {/* EMPTY */}

                                    {!loading &&
                                        filteredQuizzes.length === 0 && (

                                        <tr>

                                            <td
                                                colSpan={
                                                    isStudent
                                                        ? 11
                                                        : 8
                                                }
                                                className="
                                                    text-center
                                                "
                                            >
                                                No quizzes found.
                                            </td>

                                        </tr>

                                    )}


                                    {/* QUIZ ROWS */}

                                    {!loading &&
                                        filteredQuizzes.map(
                                            (quiz) => {

                                                const maxAttempts =
                                                    getMaxAttempts(
                                                        quiz
                                                    );

                                                const attemptCount =
                                                    isStudent
                                                        ? getAttemptCount(
                                                            quiz
                                                        )
                                                        : 0;

                                                const latestAttempt =
                                                    isStudent
                                                        ? getLatestAttempt(
                                                            quiz
                                                        )
                                                        : null;

                                                const status =
                                                    isStudent
                                                        ? getQuizStatus(
                                                            quiz
                                                        )
                                                        : null;

                                                const canAttempt =
                                                    isStudent
                                                        ? canAttemptQuiz(
                                                            quiz
                                                        )
                                                        : false;

                                                return (

                                                    <tr
                                                        key={
                                                            quiz.id
                                                        }
                                                    >

                                                        {/* ID */}

                                                        <td>
                                                            {
                                                                quiz.id
                                                            }
                                                        </td>


                                                        {/* TITLE */}

                                                        <td>

                                                            <strong>
                                                                {
                                                                    quiz.title ||
                                                                    "-"
                                                                }
                                                            </strong>

                                                        </td>


                                                        {/* DESCRIPTION */}

                                                        <td>
                                                            {
                                                                quiz.description ||
                                                                "-"
                                                            }
                                                        </td>


                                                        {/* MARKS */}

                                                        <td>
                                                            {
                                                                quiz.totalMarks ??
                                                                "-"
                                                            }
                                                        </td>


                                                        {/* DURATION */}

                                                        <td>
                                                            {
                                                                quiz.durationMinutes ??
                                                                "-"
                                                            }{" "}
                                                            mins
                                                        </td>


                                                        {/* MAX ATTEMPTS */}

                                                        <td>

                                                            <span
                                                                className="
                                                                    badge
                                                                    bg-dark
                                                                "
                                                            >
                                                                {
                                                                    maxAttempts
                                                                }
                                                            </span>

                                                            <div
                                                                className="
                                                                    small
                                                                    text-muted
                                                                    mt-1
                                                                "
                                                            >

                                                                {
                                                                    maxAttempts === 1
                                                                        ? "1 attempt"
                                                                        : `${maxAttempts} attempts`
                                                                }

                                                            </div>

                                                        </td>


                                                        {/* STUDENT ATTEMPTS */}

                                                        {isStudent && (

                                                            <>

                                                                {/* ATTEMPT COUNT */}

                                                                <td>

                                                                    <strong>
                                                                        {
                                                                            attemptCount
                                                                        }
                                                                    </strong>

                                                                    {" / "}

                                                                    {
                                                                        maxAttempts
                                                                    }

                                                                </td>


                                                                {/* STATUS */}

                                                                <td>

                                                                    {status && (

                                                                        <span
                                                                            className={`
                                                                                badge
                                                                                ${status.className}
                                                                            `}
                                                                        >
                                                                            {
                                                                                status.text
                                                                            }
                                                                        </span>

                                                                    )}

                                                                </td>


                                                                {/* SCORE */}

                                                                <td>

                                                                    {latestAttempt ? (

                                                                        <strong>

                                                                            {
                                                                                latestAttempt.score ??
                                                                                0
                                                                            }

                                                                            {" / "}

                                                                            {
                                                                                latestAttempt.totalMarks ??
                                                                                quiz.totalMarks ??
                                                                                0
                                                                            }

                                                                        </strong>

                                                                    ) : (

                                                                        <span
                                                                            className="
                                                                                text-muted
                                                                            "
                                                                        >
                                                                            -
                                                                        </span>

                                                                    )}

                                                                </td>

                                                            </>

                                                        )}


                                                        {/* TOPIC */}

                                                        <td>

                                                            {
                                                                quiz.topic?.title ??
                                                                quiz.topicTitle ??
                                                                "-"
                                                            }

                                                        </td>


                                                        {/* ACTIONS */}

                                                        <td
                                                            style={{
                                                                minWidth:
                                                                    "180px"
                                                            }}
                                                        >


                                                            {/* STUDENT */}

                                                            {isStudent && (

                                                                <>

                                                                    {canAttempt ? (

                                                                        <Link
                                                                            to={`/quizzes/attend/${quiz.id}`}
                                                                            className={
                                                                                status?.type ===
                                                                                "IN_PROGRESS"
                                                                                    ? `
                                                                                        btn
                                                                                        btn-warning
                                                                                        btn-sm
                                                                                    `
                                                                                    : `
                                                                                        btn
                                                                                        btn-primary
                                                                                        btn-sm
                                                                                    `
                                                                            }
                                                                        >

                                                                            {
                                                                                getButtonText(
                                                                                    quiz
                                                                                )
                                                                            }

                                                                        </Link>

                                                                    ) : (

                                                                        <button
                                                                            type="button"
                                                                            className="
                                                                                btn
                                                                                btn-secondary
                                                                                btn-sm
                                                                            "
                                                                            disabled
                                                                        >
                                                                            Attempts Finished
                                                                        </button>

                                                                    )}

                                                                </>

                                                            )}


                                                            {/* ADMIN / TEACHER */}

                                                            {(isAdmin ||
                                                                isTeacher) && (

                                                                <>

                                                                    <Link
                                                                        to={`/quizzes/edit/${quiz.id}`}
                                                                        className="
                                                                            btn
                                                                            btn-warning
                                                                            btn-sm
                                                                            me-2
                                                                        "
                                                                    >
                                                                        Edit
                                                                    </Link>


                                                                    <button
                                                                        type="button"
                                                                        className="
                                                                            btn
                                                                            btn-danger
                                                                            btn-sm
                                                                        "
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                quiz.id
                                                                            )
                                                                        }
                                                                    >
                                                                        Delete
                                                                    </button>

                                                                </>

                                                            )}

                                                        </td>

                                                    </tr>

                                                );
                                            }
                                        )
                                    }

                                </tbody>

                            </table>

                        </div>


                        {/* ==================================================
                            STUDENT INFORMATION
                        ================================================== */}

                        {isStudent &&
                            !attemptsLoading && (

                            <div
                                className="
                                    mt-3
                                    small
                                    text-muted
                                "
                            >

                                <strong>
                                    Attempt status:
                                </strong>{" "}

                                NOT ATTEMPTED =
                                You have not started
                                the quiz.{" "}

                                ATTEMPTED =
                                You still have
                                attempts remaining.{" "}

                                COMPLETED =
                                Maximum attempts
                                have been used.

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default QuizList;