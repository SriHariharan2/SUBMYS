import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import CourseService from "../../services/CourseService";
import EventService from "../../services/EventService";

function EventForm() {

    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [courses, setCourses] = useState([]);

    const [loadingCourses, setLoadingCourses] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [event, setEvent] = useState({
        title: "",
        description: "",
        eventDate: "",
        startTime: "",
        endTime: "",
        eventType: "QUIZ"
    });

    const [selectedCourseId, setSelectedCourseId] = useState("");

    // =====================================================
    // GET CURRENT USER ID
    // =====================================================

    const getUserId = () => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (storedUser) {

                const user =
                    JSON.parse(storedUser);

                return user?.id;

            }

        } catch (error) {

            console.error(
                "Unable to read user:",
                error
            );
        }

        return null;
    };

    // =====================================================
    // LOAD COURSES
    // =====================================================

    useEffect(() => {

        loadCourses();

    }, []);

    const loadCourses = async () => {

        try {

            setLoadingCourses(true);

            setError("");

            console.log(
                "Loading courses..."
            );

            const response =
                await CourseService.getAllCourses();

            console.log(
                "COURSES RESPONSE:",
                response
            );

            console.log(
                "COURSES DATA:",
                response.data
            );

            /*
             * Depending on your backend,
             * response.data should be an array.
             */

            if (Array.isArray(response.data)) {

                setCourses(response.data);

            } else if (
                response.data &&
                Array.isArray(response.data.content)
            ) {

                setCourses(
                    response.data.content
                );

            } else {

                console.error(
                    "Unexpected courses response:",
                    response.data
                );

                setCourses([]);

                setError(
                    "Courses response is not an array."
                );
            }

        } catch (error) {

            console.error(
                "LOAD COURSES ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );

            setCourses([]);

            setError(
                error.response?.data?.message ||
                "Unable to load courses."
            );

        } finally {

            setLoadingCourses(false);

        }
    };

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setEvent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // =====================================================
    // CREATE EVENT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        // -------------------------------------------------
        // VALIDATE COURSE
        // -------------------------------------------------

        if (!selectedCourseId) {

            alert(
                "Please select a course."
            );

            return;
        }

        // -------------------------------------------------
        // VALIDATE TITLE
        // -------------------------------------------------

        if (!event.title.trim()) {

            alert(
                "Please enter event title."
            );

            return;
        }

        // -------------------------------------------------
        // VALIDATE DATE
        // -------------------------------------------------

        if (!event.eventDate) {

            alert(
                "Please select event date."
            );

            return;
        }

        // -------------------------------------------------
        // VALIDATE TIME
        // -------------------------------------------------

        if (!event.startTime) {

            alert(
                "Please select start time."
            );

            return;
        }

        if (!event.endTime) {

            alert(
                "Please select end time."
            );

            return;
        }

        if (
            event.startTime >=
            event.endTime
        ) {

            alert(
                "End time must be after start time."
            );

            return;
        }

        // -------------------------------------------------
        // GET USER ID
        // -------------------------------------------------

        const userId = getUserId();

        console.log(
            "CURRENT USER ID:",
            userId
        );

        if (!userId) {

            alert(
                "Unable to find logged-in user."
            );

            return;
        }

        // -------------------------------------------------
        // DATA SENT TO BACKEND
        // -------------------------------------------------

        const eventData = {

            title:
                event.title.trim(),

            description:
                event.description.trim(),

            eventDate:
                event.eventDate,

            startTime:
                event.startTime,

            endTime:
                event.endTime,

            eventType:
                event.eventType

        };

        console.log(
            "================================="
        );

        console.log(
            "CREATING EVENT"
        );

        console.log(
            "Course ID:",
            selectedCourseId
        );

        console.log(
            "Creator ID:",
            userId
        );

        console.log(
            "Event Data:",
            eventData
        );

        console.log(
            "================================="
        );

        try {

            setSaving(true);

            const response =
                await EventService.createEvent(
                    selectedCourseId,
                    userId,
                    eventData
                );

            console.log(
                "EVENT CREATED:",
                response.data
            );

            alert(
                "Event created successfully!"
            );

            // -------------------------------------------------
            // RESET FORM
            // -------------------------------------------------

            setSelectedCourseId("");

            setEvent({

                title: "",

                description: "",

                eventDate: "",

                startTime: "",

                endTime: "",

                eventType: "QUIZ"

            });

            // -------------------------------------------------
            // GO TO EVENT LIST
            // -------------------------------------------------

            navigate("/events");

        } catch (error) {

            console.error(
                "================================="
            );

            console.error(
                "CREATE EVENT ERROR"
            );

            console.error(
                "================================="
            );

            console.error(
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );

            alert(

                error.response?.data?.message ||

                error.response?.data ||

                "Unable to create event."

            );

        } finally {

            setSaving(false);

        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h2 className="mb-0">
                            Create Event
                        </h2>

                    </div>

                    <div className="card-body">

                        {error && (

                            <div className="alert alert-danger">

                                {error}

                            </div>

                        )}

                        <form
                            onSubmit={handleSubmit}
                        >

                            {/* ================= COURSE ================= */}

                            <div className="mb-3">

                                <label className="form-label">

                                    Course

                                </label>

                                <select

                                    className="form-select"

                                    value={
                                        selectedCourseId
                                    }

                                    onChange={(e) =>
                                        setSelectedCourseId(
                                            e.target.value
                                        )
                                    }

                                    disabled={
                                        loadingCourses
                                    }

                                >

                                    <option value="">

                                        {loadingCourses
                                            ? "Loading courses..."
                                            : "Select Course"}

                                    </option>

                                    {courses.map(course => (

                                        <option
                                            key={course.id}
                                            value={course.id}
                                        >

                                            {course.title ||
                                             course.name ||
                                             `Course ${course.id}`}

                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* ================= TITLE ================= */}

                            <div className="mb-3">

                                <label className="form-label">

                                    Event Title

                                </label>

                                <input

                                    type="text"

                                    className="form-control"

                                    name="title"

                                    value={
                                        event.title
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    placeholder="Enter event title"

                                    required

                                />

                            </div>


                            {/* ================= DESCRIPTION ================= */}

                            <div className="mb-3">

                                <label className="form-label">

                                    Description

                                </label>

                                <textarea

                                    className="form-control"

                                    name="description"

                                    value={
                                        event.description
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    rows="4"

                                    placeholder="Enter event description"

                                />

                            </div>


                            {/* ================= EVENT TYPE ================= */}

                            <div className="mb-3">

                                <label className="form-label">

                                    Event Type

                                </label>

                                <select

                                    className="form-select"

                                    name="eventType"

                                    value={
                                        event.eventType
                                    }

                                    onChange={
                                        handleChange
                                    }

                                >

                                    <option value="QUIZ">
                                        Quiz
                                    </option>

                                    <option value="LECTURE">
                                        Lecture
                                    </option>

                                    <option value="ASSIGNMENT_DEADLINE">
                                        Assignment Deadline
                                    </option>

                                    <option value="EXAM">
                                        Exam
                                    </option>

                                    <option value="LIVE_SESSION">
                                        Live Session
                                    </option>

                                    <option value="MEETING">
                                        Meeting
                                    </option>

                                    <option value="WORKSHOP">
                                        Workshop
                                    </option>

                                </select>

                            </div>


                            {/* ================= DATE ================= */}

                            <div className="mb-3">

                                <label className="form-label">

                                    Event Date

                                </label>

                                <input

                                    type="date"

                                    className="form-control"

                                    name="eventDate"

                                    value={
                                        event.eventDate
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    required

                                />

                            </div>


                            {/* ================= START TIME ================= */}

                            <div className="mb-3">

                                <label className="form-label">

                                    Start Time

                                </label>

                                <input

                                    type="time"

                                    className="form-control"

                                    name="startTime"

                                    value={
                                        event.startTime
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    required

                                />

                            </div>


                            {/* ================= END TIME ================= */}

                            <div className="mb-3">

                                <label className="form-label">

                                    End Time

                                </label>

                                <input

                                    type="time"

                                    className="form-control"

                                    name="endTime"

                                    value={
                                        event.endTime
                                    }

                                    onChange={
                                        handleChange
                                    }

                                    required

                                />

                            </div>


                            {/* ================= BUTTONS ================= */}

                            <div className="d-flex gap-2">

                                <button

                                    type="submit"

                                    className="btn btn-primary"

                                    disabled={
                                        saving ||
                                        loadingCourses
                                    }

                                >

                                    {saving
                                        ? "Saving..."
                                        : "Save Event"}

                                </button>


                                <button

                                    type="button"

                                    className="btn btn-secondary"

                                    onClick={() =>
                                        navigate("/events")
                                    }

                                    disabled={
                                        saving
                                    }

                                >

                                    Cancel

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );
}

export default EventForm;