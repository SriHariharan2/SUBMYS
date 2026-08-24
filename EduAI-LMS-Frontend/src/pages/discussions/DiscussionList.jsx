import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import EnrollmentService from "../../services/EnrollmentService";
import CourseService from "../../services/CourseService";
import DiscussionService from "../../services/DiscussionService";

import {
    getUser
} from "../../utils/localStorage";

function DiscussionList() {

    // =====================================================
    // USER
    // =====================================================

    const loggedUser = getUser();

    const userId =
        loggedUser?.id
            ? Number(loggedUser.id)
            : null;

    const userRole =
        loggedUser?.role
            ? loggedUser.role
                .toString()
                .replace("ROLE_", "")
                .toUpperCase()
            : "";

    const isStudent =
        userRole === "STUDENT";

    const isTeacher =
        userRole === "TEACHER";

    const isAdmin =
        userRole === "ADMIN";


    // =====================================================
    // STATE
    // =====================================================

    const [courses, setCourses] =
        useState([]);

    const [selectedCourseId, setSelectedCourseId] =
        useState(null);

    const [messages, setMessages] =
        useState([]);

    const [message, setMessage] =
        useState("");

    const [editingId, setEditingId] =
        useState(null);

    const [editingMessage, setEditingMessage] =
        useState("");

    const [loadingCourses, setLoadingCourses] =
        useState(true);

    const [loadingMessages, setLoadingMessages] =
        useState(false);

    const [sending, setSending] =
        useState(false);

    const [error, setError] =
        useState("");


    // =====================================================
    // LOAD COURSES
    // =====================================================

    useEffect(() => {

        loadCourses();

    }, []);


    // =====================================================
    // LOAD CHAT WHEN COURSE CHANGES
    // =====================================================

    useEffect(() => {

        if (!selectedCourseId) {

            setMessages([]);

            return;
        }

        loadMessages(selectedCourseId);

    }, [selectedCourseId]);


    // =====================================================
    // LOAD COURSES
    // =====================================================

    const loadCourses = async () => {

        setLoadingCourses(true);

        setError("");

        try {

            // =================================================
            // STUDENT
            // =================================================

            if (isStudent) {

                if (!userId) {

                    setCourses([]);

                    setSelectedCourseId(null);

                    setError(
                        "Unable to identify the logged-in student."
                    );

                    return;
                }


                console.log(
                    "Loading enrolled courses for student:",
                    userId
                );


                // ---------------------------------------------
                // GET STUDENT COURSE IDS
                // ---------------------------------------------

                const enrollmentResponse =
                    await EnrollmentService
                        .getStudentCourseIds(
                            userId
                        );


                console.log(
                    "Student course IDs response:",
                    enrollmentResponse.data
                );


                let courseIds = [];


                if (
                    Array.isArray(
                        enrollmentResponse.data
                    )
                ) {

                    courseIds =
                        enrollmentResponse.data
                            .map(
                                id => Number(id)
                            )
                            .filter(
                                id =>
                                    Number.isFinite(id)
                            );

                }


                console.log(
                    "Enrolled course IDs:",
                    courseIds
                );


                // ---------------------------------------------
                // GET ALL COURSES
                // ---------------------------------------------

                const courseResponse =
                    await CourseService
                        .getAllCourses();


                const allCourses =
                    Array.isArray(
                        courseResponse.data
                    )
                        ? courseResponse.data
                        : [];


                console.log(
                    "All courses:",
                    allCourses
                );


                // ---------------------------------------------
                // FILTER ENROLLED COURSES
                // ---------------------------------------------

                const studentCourses =
                    allCourses.filter(
                        course =>
                            course?.id != null &&
                            courseIds.includes(
                                Number(course.id)
                            )
                    );


                console.log(
                    "Student enrolled courses:",
                    studentCourses
                );


                setCourses(
                    studentCourses
                );


                // ---------------------------------------------
                // SELECT FIRST COURSE
                // ---------------------------------------------

                if (
                    studentCourses.length > 0
                ) {

                    setSelectedCourseId(
                        studentCourses[0].id
                    );

                } else {

                    setSelectedCourseId(
                        null
                    );

                }

                return;
            }


            // =================================================
            // ADMIN / TEACHER
            // =================================================

            const response =
                await CourseService
                    .getAllCourses();


            const allCourses =
                Array.isArray(
                    response.data
                )
                    ? response.data
                    : [];


            setCourses(
                allCourses
            );


            if (
                allCourses.length > 0
            ) {

                setSelectedCourseId(
                    allCourses[0].id
                );

            } else {

                setSelectedCourseId(
                    null
                );

            }

        } catch (err) {

            console.error(
                "Unable to load courses:",
                err
            );

            setCourses([]);

            setSelectedCourseId(null);

            setError(
                "Unable to load your courses."
            );

        } finally {

            setLoadingCourses(false);

        }
    };


    // =====================================================
    // LOAD MESSAGES
    // =====================================================

    const loadMessages = async (
        courseId
    ) => {

        setLoadingMessages(true);

        try {

            console.log(
                "Loading chat for course:",
                courseId
            );


            const response =
                await DiscussionService
                    .getByCourse(
                        courseId
                    );


            const data =
                Array.isArray(
                    response.data
                )
                    ? response.data
                    : [];


            console.log(
                "Course discussion response:",
                data
            );


            setMessages(
                data
            );

        } catch (err) {

            console.error(
                "Unable to load course chat:",
                err
            );

            setMessages([]);

        } finally {

            setLoadingMessages(false);

        }
    };


    // =====================================================
    // SEND MESSAGE
    // =====================================================

    const sendMessage = async () => {

        const trimmedMessage =
            message.trim();


        if (!trimmedMessage) {

            return;
        }


        if (!selectedCourseId) {

            alert(
                "Please select a course."
            );

            return;
        }


        if (!userId) {

            alert(
                "Unable to identify the logged-in user."
            );

            return;
        }


        setSending(true);


        try {

            await DiscussionService.create(

                selectedCourseId,

                userId,

                {
                    title: "Course Chat",
                    content: trimmedMessage
                }

            );


            setMessage("");


            await loadMessages(
                selectedCourseId
            );

        } catch (err) {

            console.error(
                "Unable to send message:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Unable to send message."
            );

        } finally {

            setSending(false);

        }
    };


    // =====================================================
    // ENTER KEY
    // =====================================================

    const handleMessageKeyDown = (
        e
    ) => {

        if (
            e.key === "Enter" &&
            !e.shiftKey
        ) {

            e.preventDefault();

            sendMessage();
        }
    };


    // =====================================================
    // CAN EDIT MESSAGE
    // =====================================================

    const canEdit = (
        msg
    ) => {

        if (isAdmin || isTeacher) {

            return true;
        }


        return (
            Number(msg.userId) ===
            Number(userId)
        );
    };


    // =====================================================
    // CAN DELETE MESSAGE
    // =====================================================

    const canDelete = (
        msg
    ) => {

        if (isAdmin || isTeacher) {

            return true;
        }


        return (
            Number(msg.userId) ===
            Number(userId)
        );
    };


    // =====================================================
    // START EDIT
    // =====================================================

    const startEdit = (
        msg
    ) => {

        setEditingId(
            msg.id
        );

        setEditingMessage(
            msg.content || ""
        );
    };


    // =====================================================
    // CANCEL EDIT
    // =====================================================

    const cancelEdit = () => {

        setEditingId(null);

        setEditingMessage("");
    };


    // =====================================================
    // SAVE EDIT
    // =====================================================

    const saveEdit = async (
        id
    ) => {

        const trimmedMessage =
            editingMessage.trim();


        if (!trimmedMessage) {

            alert(
                "Message cannot be empty."
            );

            return;
        }


        try {

            await DiscussionService.update(

                id,

                {
                    title: "Course Chat",
                    content: trimmedMessage
                }

            );


            cancelEdit();


            await loadMessages(
                selectedCourseId
            );

        } catch (err) {

            console.error(
                "Unable to update message:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Unable to update message."
            );
        }
    };


    // =====================================================
    // DELETE MESSAGE
    // =====================================================

    const deleteMessage = async (
        id
    ) => {

        if (
            !window.confirm(
                "Delete this message?"
            )
        ) {

            return;
        }


        try {

            await DiscussionService.remove(
                id
            );


            await loadMessages(
                selectedCourseId
            );

        } catch (err) {

            console.error(
                "Unable to delete message:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Unable to delete message."
            );
        }
    };


    // =====================================================
    // SELECTED COURSE
    // =====================================================

    const selectedCourse =
        courses.find(
            course =>
                Number(course.id) ===
                Number(selectedCourseId)
        );


    // =====================================================
    // FORMAT TIME
    // =====================================================

    const formatTime = (
        date
    ) => {

        if (!date) {

            return "";
        }


        try {

            return new Date(
                date
            ).toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

        } catch {

            return "";
        }
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <DashboardLayout>

            <div
                className="container-fluid"
                style={{
                    padding: "20px"
                }}
            >

                <div
                    className="card shadow-sm"
                    style={{
                        height: "calc(100vh - 150px)",
                        minHeight: "550px"
                    }}
                >

                    <div
                        className="row g-0 h-100"
                    >

                        {/* =================================================
                            LEFT - COURSES
                        ================================================= */}

                        <div
                            className="col-md-3 border-end"
                            style={{
                                background: "#f8f9fa"
                            }}
                        >

                            <div
                                className="p-3 border-bottom"
                            >

                                <h4 className="mb-0">

                                    💬 My Courses

                                </h4>

                            </div>


                            {/* LOADING */}

                            {loadingCourses && (

                                <div
                                    className="p-4 text-center text-muted"
                                >

                                    Loading courses...

                                </div>

                            )}


                            {/* ERROR */}

                            {!loadingCourses &&
                                error && (

                                    <div
                                        className="p-3"
                                    >

                                        <div
                                            className="alert alert-danger"
                                        >

                                            {error}

                                        </div>

                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={
                                                loadCourses
                                            }
                                        >

                                            Retry

                                        </button>

                                    </div>

                                )}


                            {/* NO COURSES */}

                            {!loadingCourses &&
                                !error &&
                                courses.length === 0 && (

                                    <div
                                        className="p-4 text-center text-muted"
                                    >

                                        {isStudent
                                            ? "You are not enrolled in any course."
                                            : "No courses found."
                                        }

                                    </div>

                                )}


                            {/* COURSE LIST */}

                            {!loadingCourses &&
                                courses.length > 0 && (

                                    <div>

                                        {courses.map(
                                            course => (

                                                <button
                                                    key={
                                                        course.id
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedCourseId(
                                                            course.id
                                                        )
                                                    }
                                                    className="w-100 text-start border-0"
                                                    style={{
                                                        padding:
                                                            "15px",
                                                        background:
                                                            Number(
                                                                selectedCourseId
                                                            ) ===
                                                            Number(
                                                                course.id
                                                            )
                                                                ? "#e7f0ff"
                                                                : "transparent",
                                                        borderBottom:
                                                            "1px solid #ddd"
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            fontWeight:
                                                                "600",
                                                            fontSize:
                                                                "16px"
                                                        }}
                                                    >

                                                        💬{" "}

                                                        {course.title ||
                                                            course.name ||
                                                            "Untitled Course"}

                                                    </div>


                                                    <small
                                                        className="text-muted"
                                                    >

                                                        Open course chat

                                                    </small>

                                                </button>

                                            )
                                        )}

                                    </div>

                                )}

                        </div>


                        {/* =================================================
                            RIGHT - CHAT
                        ================================================= */}

                        <div
                            className="col-md-9 d-flex flex-column"
                        >

                            {/* CHAT HEADER */}

                            <div
                                className="p-3 text-white"
                                style={{
                                    background:
                                        "#0d6efd"
                                }}
                            >

                                <h4
                                    className="mb-1"
                                >

                                    💬{" "}

                                    {selectedCourse
                                        ? (
                                            selectedCourse.title ||
                                            selectedCourse.name
                                        )
                                        : "Course Chat"
                                    }

                                </h4>


                                <small>

                                    Course group chat

                                </small>

                            </div>


                            {/* MESSAGES */}

                            <div
                                className="flex-grow-1"
                                style={{
                                    overflowY:
                                        "auto",
                                    background:
                                        "#f1f3f5",
                                    padding:
                                        "20px"
                                }}
                            >

                                {!selectedCourseId && (

                                    <div
                                        className="h-100 d-flex align-items-center justify-content-center text-muted"
                                    >

                                        Select a course to open
                                        the group chat.

                                    </div>

                                )}


                                {selectedCourseId &&
                                    loadingMessages && (

                                        <div
                                            className="text-center text-muted mt-5"
                                        >

                                            Loading messages...

                                        </div>

                                    )}


                                {selectedCourseId &&
                                    !loadingMessages &&
                                    messages.length === 0 && (

                                        <div
                                            className="h-100 d-flex align-items-center justify-content-center text-muted"
                                        >

                                            <div
                                                className="text-center"
                                            >

                                                <h5>

                                                    No messages yet.

                                                </h5>

                                                <p>

                                                    Start the
                                                    conversation
                                                    with your
                                                    classmates.

                                                </p>

                                            </div>

                                        </div>

                                    )}


                                {/* MESSAGE LIST */}

                                {!loadingMessages &&
                                    messages.map(
                                        msg => {

                                            const mine =
                                                Number(
                                                    msg.userId
                                                ) ===
                                                Number(
                                                    userId
                                                );


                                            return (

                                                <div
                                                    key={
                                                        msg.id
                                                    }
                                                    className="mb-3"
                                                >

                                                    {/* USER + TIME */}

                                                    <div
                                                        className={
                                                            mine
                                                                ? "text-end"
                                                                : "text-start"
                                                        }
                                                    >

                                                        <small
                                                            className="text-muted"
                                                        >

                                                            {mine
                                                                ? "You"
                                                                : (
                                                                    msg.userName ||
                                                                    "User"
                                                                )
                                                            }

                                                            {" • "}

                                                            {formatTime(
                                                                msg.createdAt
                                                            )}

                                                        </small>

                                                    </div>


                                                    {/* MESSAGE */}

                                                    <div
                                                        className={
                                                            mine
                                                                ? "d-flex justify-content-end"
                                                                : "d-flex justify-content-start"
                                                        }
                                                    >

                                                        {editingId ===
                                                        msg.id ? (

                                                            <div
                                                                className="bg-white border rounded p-2"
                                                                style={{
                                                                    maxWidth:
                                                                        "70%",
                                                                    minWidth:
                                                                        "300px"
                                                                }}
                                                            >

                                                                <textarea
                                                                    className="form-control mb-2"
                                                                    rows="3"
                                                                    value={
                                                                        editingMessage
                                                                    }
                                                                    onChange={
                                                                        e =>
                                                                            setEditingMessage(
                                                                                e.target.value
                                                                            )
                                                                    }
                                                                />

                                                                <button
                                                                    className="btn btn-success btn-sm me-2"
                                                                    onClick={() =>
                                                                        saveEdit(
                                                                            msg.id
                                                                        )
                                                                    }
                                                                >

                                                                    Save

                                                                </button>


                                                                <button
                                                                    className="btn btn-secondary btn-sm"
                                                                    onClick={
                                                                        cancelEdit
                                                                    }
                                                                >

                                                                    Cancel

                                                                </button>

                                                            </div>

                                                        ) : (

                                                            <div
                                                                style={{
                                                                    maxWidth:
                                                                        "70%",
                                                                    padding:
                                                                        "12px 16px",
                                                                    borderRadius:
                                                                        "12px",
                                                                    background:
                                                                        mine
                                                                            ? "#0d6efd"
                                                                            : "#ffffff",
                                                                    color:
                                                                        mine
                                                                            ? "#ffffff"
                                                                            : "#212529",
                                                                    boxShadow:
                                                                        "0 1px 3px rgba(0,0,0,0.15)",
                                                                    wordBreak:
                                                                        "break-word"
                                                                }}
                                                            >

                                                                {msg.content}

                                                            </div>

                                                        )}

                                                    </div>


                                                    {/* ACTIONS */}

                                                    {editingId !==
                                                        msg.id && (

                                                            <div
                                                                className={
                                                                    mine
                                                                        ? "text-end"
                                                                        : "text-start"
                                                                }
                                                            >

                                                                {canEdit(
                                                                    msg
                                                                ) && (

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link btn-sm text-warning p-0 me-2"
                                                                        onClick={() =>
                                                                            startEdit(
                                                                                msg
                                                                            )
                                                                        }
                                                                    >

                                                                        Edit

                                                                    </button>

                                                                )}


                                                                {canDelete(
                                                                    msg
                                                                ) && (

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-link btn-sm text-danger p-0"
                                                                        onClick={() =>
                                                                            deleteMessage(
                                                                                msg.id
                                                                            )
                                                                        }
                                                                    >

                                                                        Delete

                                                                    </button>

                                                                )}

                                                            </div>

                                                        )}

                                                </div>

                                            );

                                        }
                                    )}

                            </div>


                            {/* =================================================
                                MESSAGE INPUT
                            ================================================= */}

                            <div
                                className="border-top p-3"
                                style={{
                                    background:
                                        "#ffffff"
                                }}
                            >

                                {selectedCourseId ? (

                                    <>

                                        <div
                                            className="d-flex gap-2"
                                        >

                                            <textarea
                                                className="form-control"
                                                rows="2"
                                                placeholder="Type a message..."
                                                value={
                                                    message
                                                }
                                                onChange={
                                                    e =>
                                                        setMessage(
                                                            e.target.value
                                                        )
                                                }
                                                onKeyDown={
                                                    handleMessageKeyDown
                                                }
                                                disabled={
                                                    sending
                                                }
                                            />


                                            <button
                                                className="btn btn-primary"
                                                onClick={
                                                    sendMessage
                                                }
                                                disabled={
                                                    sending ||
                                                    !message.trim()
                                                }
                                            >

                                                {sending
                                                    ? "Sending..."
                                                    : "Send"
                                                }

                                            </button>

                                        </div>


                                        <small
                                            className="text-muted"
                                        >

                                            Press Enter to send.
                                            Shift + Enter for a
                                            new line.

                                        </small>

                                    </>

                                ) : (

                                    <div
                                        className="text-muted text-center"
                                    >

                                        Select a course to start
                                        chatting.

                                    </div>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default DiscussionList;