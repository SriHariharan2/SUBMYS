import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import EventService from "../../services/EventService";

function EventList() {

    // ================= STATES =================

    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [courseFilter, setCourseFilter] = useState("");

    const [typeFilter, setTypeFilter] = useState("");

    // ================= PAGINATION =================

    const [currentPage, setCurrentPage] = useState(1);

    const recordsPerPage = 10;

    // ================= LOAD EVENTS =================

    useEffect(() => {

        loadEvents();

    }, []);

    const loadEvents = async () => {

        setLoading(true);

        try {

            const response =
                await EventService.getAllEvents();

            setEvents(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(error);

            alert("Unable to load events.");

            setEvents([]);

        } finally {

            setLoading(false);

        }

    };

    // ================= DELETE EVENT =================

    const deleteEvent = async (id) => {

        if (!window.confirm("Delete this event?")) {
            return;
        }

        try {

            await EventService.deleteEvent(id);

            loadEvents();

        } catch (error) {

            console.error(error);

            alert("Unable to delete event.");

        }

    };

    // ================= FORMAT TIME =================

    const formatTime = (time) => {

        if (!time) {
            return "-";
        }

        return time.substring(0, 5);

    };

    // ================= FILTER EVENTS =================

    const filteredEvents = useMemo(() => {

        return events.filter((event) => {

            const title =
                event.title?.toLowerCase() || "";

            const course =
                event.course?.title || "";

            const eventType =
                event.eventType || "";

            const matchesSearch =
                title.includes(
                    search.toLowerCase()
                );

            const matchesCourse =
                courseFilter === "" ||
                course === courseFilter;

            const matchesType =
                typeFilter === "" ||
                eventType === typeFilter;

            return (
                matchesSearch &&
                matchesCourse &&
                matchesType
            );

        });

    }, [
        events,
        search,
        courseFilter,
        typeFilter
    ]);

    // ================= COURSE LIST =================

    const courses = [
        ...new Set(
            events.map(
                (event) => event.course?.title
            )
        )
    ].filter(Boolean);

    // ================= EVENT TYPE LIST =================

    const eventTypes = [
        ...new Set(
            events.map(
                (event) => event.eventType
            )
        )
    ].filter(Boolean);

    // ================= PAGINATION =================

    const indexOfLastRecord =
        currentPage * recordsPerPage;

    const indexOfFirstRecord =
        indexOfLastRecord - recordsPerPage;

    const currentEvents =
        filteredEvents.slice(
            indexOfFirstRecord,
            indexOfLastRecord
        );

    const totalPages = Math.ceil(
        filteredEvents.length /
        recordsPerPage
    );

    return (

        <DashboardLayout>

            <div className="container mt-4">
                                {/* ================= HEADER ================= */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <div className="row g-3 align-items-end">

                            {/* Search */}

                            <div className="col-lg-4">

                                <label className="form-label fw-bold">
                                    Search Event
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by event title..."
                                    value={search}
                                    onChange={(e) => {

                                        setSearch(e.target.value);

                                        setCurrentPage(1);

                                    }}
                                />

                            </div>

                            {/* Course Filter */}

                            <div className="col-lg-3">

                                <label className="form-label fw-bold">
                                    Course
                                </label>

                                <select
                                    className="form-select"
                                    value={courseFilter}
                                    onChange={(e) => {

                                        setCourseFilter(
                                            e.target.value
                                        );

                                        setCurrentPage(1);

                                    }}
                                >

                                    <option value="">
                                        All Courses
                                    </option>

                                    {courses.map((course) => (

                                        <option
                                            key={course}
                                            value={course}
                                        >
                                            {course}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* Event Type Filter */}

                            <div className="col-lg-3">

                                <label className="form-label fw-bold">
                                    Event Type
                                </label>

                                <select
                                    className="form-select"
                                    value={typeFilter}
                                    onChange={(e) => {

                                        setTypeFilter(
                                            e.target.value
                                        );

                                        setCurrentPage(1);

                                    }}
                                >

                                    <option value="">
                                        All Types
                                    </option>

                                    {eventTypes.map((type) => (

                                        <option
                                            key={type}
                                            value={type}
                                        >
                                            {type}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            {/* Reset */}

                            <div className="col-lg-2 d-grid">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {

                                        setSearch("");

                                        setCourseFilter("");

                                        setTypeFilter("");

                                        setCurrentPage(1);

                                    }}
                                >
                                    Reset
                                </button>

                            </div>

                        </div>

                        <hr />

                        {/* PAGE HEADER */}

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <h2 className="mb-1">
                                    Calendar & Events
                                </h2>

                                <span className="badge bg-primary">

                                    Total Records :
                                    {" "}
                                    {filteredEvents.length}

                                </span>

                            </div>

                            <div>

                                <button
                                    className="btn btn-outline-primary me-2"
                                    onClick={loadEvents}
                                >

                                    Refresh

                                </button>

                                <Link
                                    to="/events/add"
                                    className="btn btn-success"
                                >

                                    Add Event

                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ================= EVENT TABLE ================= */}

                <div className="card shadow">

                    <div className="card-body">
                                                {loading ? (

                            <div className="text-center py-5">

                                <div className="spinner-border text-primary"></div>

                                <p className="mt-3">
                                    Loading events...
                                </p>

                            </div>

                        ) : (

                            <>

                                <div className="table-responsive">

                                    <table className="table table-bordered table-hover align-middle">

                                        <thead className="table-dark">

                                            <tr>

                                                <th>#</th>

                                                <th>ID</th>

                                                <th>Title</th>

                                                <th>Course</th>

                                                <th>Type</th>

                                                <th>Date</th>

                                                <th>Start</th>

                                                <th>End</th>

                                                <th>Created By</th>

                                                <th width="180">
                                                    Actions
                                                </th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {currentEvents.length > 0 ? (

                                                currentEvents.map(
                                                    (event, index) => (

                                                        <tr key={event.id}>

                                                            <td>
                                                                {indexOfFirstRecord + index + 1}
                                                            </td>

                                                            <td>
                                                                {event.id}
                                                            </td>

                                                            <td>
                                                                {event.title}
                                                            </td>

                                                            <td>

                                                                <span className="badge bg-primary">

                                                                    {event.course?.title ||
                                                                        "No Course"}

                                                                </span>

                                                            </td>

                                                            <td>

                                                                <span className="badge bg-info text-dark">

                                                                    {event.eventType ||
                                                                        "General"}

                                                                </span>

                                                            </td>

                                                            <td>
                                                                {event.eventDate || "-"}
                                                            </td>

                                                            <td>
                                                                {formatTime(
                                                                    event.startTime
                                                                )}
                                                            </td>

                                                            <td>
                                                                {formatTime(
                                                                    event.endTime
                                                                )}
                                                            </td>

                                                            <td>
                                                                {event.createdBy?.fullName ||
                                                                    "Unknown"}
                                                            </td>

                                                            <td>

                                                                <Link
                                                                    to={`/events/edit/${event.id}`}
                                                                    className="btn btn-warning btn-sm me-2"
                                                                >

                                                                    Edit

                                                                </Link>

                                                                <button
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() =>
                                                                        deleteEvent(
                                                                            event.id
                                                                        )
                                                                    }
                                                                >

                                                                    Delete

                                                                </button>

                                                            </td>

                                                        </tr>

                                                    )
                                                )

                                            ) : (

                                                <tr>

                                                    <td
                                                        colSpan="10"
                                                        className="text-center py-5"
                                                    >

                                                        <h5 className="text-muted mb-1">

                                                            No events found.

                                                        </h5>

                                                        <small className="text-muted">

                                                            Try changing your search or filters.

                                                        </small>

                                                    </td>

                                                </tr>

                                            )}

                                        </tbody>

                                    </table>

                                </div>                                {/* ================= PAGINATION ================= */}

                                <div className="d-flex justify-content-between align-items-center mt-3">

                                    <small className="text-muted">

                                        Showing{" "}

                                        {currentEvents.length}

                                        {" "}of{" "}

                                        {filteredEvents.length}

                                        {" "}records

                                    </small>

                                    <nav>

                                        <ul className="pagination mb-0">

                                            {/* Previous */}

                                            <li
                                                className={`page-item ${
                                                    currentPage === 1
                                                        ? "disabled"
                                                        : ""
                                                }`}
                                            >

                                                <button
                                                    className="page-link"
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            currentPage - 1
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage === 1
                                                    }
                                                >

                                                    Previous

                                                </button>

                                            </li>

                                            {/* Page Numbers */}

                                            {[...Array(totalPages)].map(
                                                (_, index) => (

                                                    <li
                                                        key={index}
                                                        className={`page-item ${
                                                            currentPage ===
                                                            index + 1
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                    >

                                                        <button
                                                            className="page-link"
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    index + 1
                                                                )
                                                            }
                                                        >

                                                            {index + 1}

                                                        </button>

                                                    </li>

                                                )
                                            )}

                                            {/* Next */}

                                            <li
                                                className={`page-item ${
                                                    currentPage === totalPages ||
                                                    totalPages === 0
                                                        ? "disabled"
                                                        : ""
                                                }`}
                                            >

                                                <button
                                                    className="page-link"
                                                    onClick={() =>
                                                        setCurrentPage(
                                                            currentPage + 1
                                                        )
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                            totalPages ||
                                                        totalPages === 0
                                                    }
                                                >

                                                    Next

                                                </button>

                                            </li>

                                        </ul>

                                    </nav>

                                </div>

                            </>

                        )}

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default EventList;
                    