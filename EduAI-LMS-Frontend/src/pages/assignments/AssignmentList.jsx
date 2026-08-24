import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import AssignmentService from "../../services/AssignmentService";
import EnrollmentService from "../../services/EnrollmentService";
import SubmissionService from "../../services/SubmissionService";

import { getUser } from "../../utils/localStorage";

function AssignmentList() {

    // =====================================================
    // LOGGED-IN USER
    // =====================================================

    const user = getUser();

    const studentId =
        user?.id ??
        user?.userId ??
        user?.studentId ??
        null;

    const role =
        String(user?.role ?? "")
            .toUpperCase();

    const isStudent =
        role === "STUDENT";

    const isAdmin =
        role === "ADMIN";

    const isTeacher =
        role === "TEACHER";

    // =====================================================
    // ASSIGNMENTS
    // =====================================================

    const [assignments, setAssignments] =
        useState([]);

    // =====================================================
    // ENROLLED COURSES
    // =====================================================

    const [enrolledCourseIds, setEnrolledCourseIds] =
        useState([]);

    // =====================================================
    // SUBMITTED ASSIGNMENTS
    // =====================================================

    const [submittedAssignmentIds, setSubmittedAssignmentIds] =
        useState([]);

    // =====================================================
    // SEARCH
    // =====================================================

    const [search, setSearch] =
        useState("");

    // =====================================================
    // TOPIC FILTER
    // =====================================================

    const [topicFilter, setTopicFilter] =
        useState("");

    // =====================================================
    // STATUS FILTER
    // =====================================================

    const [statusFilter, setStatusFilter] =
        useState("ALL");

    // =====================================================
    // SORT
    // =====================================================

    const [sortOrder, setSortOrder] =
        useState("ASC");

    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] =
        useState(true);

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        if (
            isStudent &&
            studentId
        ) {

            loadStudentAssignments();

        } else {

            loadAssignments();

        }

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);

    // =====================================================
    // LOAD ALL ASSIGNMENTS
    // =====================================================

    const loadAssignments = async () => {

        try {

            setLoading(true);

            const response =
                await AssignmentService.getAllAssignments();

            const data =
                Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(
                        response.data?.content
                    )
                        ? response.data.content
                        : [];

            console.log(
                "All Assignments:",
                data
            );

            setAssignments(data);

        } catch (error) {

            console.error(
                "Unable to load assignments:",
                error
            );

            setAssignments([]);

            alert(
                "Unable to load assignments."
            );

        } finally {

            setLoading(false);

        }

    };

    // =====================================================
    // LOAD STUDENT ASSIGNMENTS
    // =====================================================

    const loadStudentAssignments = async () => {

        if (!studentId) {

            console.error(
                "Student ID not found."
            );

            setAssignments([]);

            setSubmittedAssignmentIds([]);

            setLoading(false);

            return;

        }

        try {

            setLoading(true);

            // =================================================
            // GET ENROLLED COURSE IDS
            // =================================================

            const enrollmentResponse =
                await EnrollmentService.getStudentCourseIds(
                    studentId
                );

            const courseIds =
                Array.isArray(
                    enrollmentResponse.data
                )
                    ? enrollmentResponse.data
                        .map(
                            id =>
                                Number(id)
                        )
                        .filter(
                            id =>
                                Number.isFinite(id)
                        )
                    : [];

            console.log(
                "Student ID:",
                studentId
            );

            console.log(
                "Student enrolled courses:",
                courseIds
            );

            setEnrolledCourseIds(
                courseIds
            );

            // =================================================
            // GET ALL ASSIGNMENTS
            // =================================================

            const assignmentResponse =
                await AssignmentService.getAllAssignments();

            const allAssignments =
                Array.isArray(
                    assignmentResponse.data
                )
                    ? assignmentResponse.data
                    : Array.isArray(
                        assignmentResponse.data?.content
                    )
                        ? assignmentResponse.data.content
                        : [];

            console.log(
                "All assignments:",
                allAssignments
            );

            // =================================================
            // FILTER BY ENROLLED COURSE
            // =================================================

            const studentAssignments =
                allAssignments.filter(
                    assignment => {

                        const courseId =
                            assignment?.courseId ??
                            assignment?.topic?.subject?.course?.id ??
                            assignment?.topic?.courseId;

                        if (
                            courseId == null
                        ) {

                            return false;

                        }

                        return courseIds.includes(
                            Number(courseId)
                        );

                    }
                );

            console.log(
                "Student assignments:",
                studentAssignments
            );

            setAssignments(
                studentAssignments
            );

            // =================================================
            // GET STUDENT SUBMISSIONS
            // =================================================

            try {

                const submissionResponse =
                    await SubmissionService.getStudentSubmissions(
                        studentId
                    );

                const submissions =
                    Array.isArray(
                        submissionResponse.data
                    )
                        ? submissionResponse.data
                        : Array.isArray(
                            submissionResponse.data?.content
                        )
                            ? submissionResponse.data.content
                            : [];

                console.log(
                    "Student submissions:",
                    submissions
                );

                // =================================================
                // GET ASSIGNMENT IDS
                // =================================================

                const submittedIds =
                    submissions
                        .map(
                            submission => {

                                /*
                                 * Supports:
                                 *
                                 * assignmentId
                                 *
                                 * assignment.id
                                 *
                                 */

                                return (
                                    submission?.assignmentId ??
                                    submission?.assignment?.id ??
                                    null
                                );

                            }
                        )
                        .map(
                            id =>
                                Number(id)
                        )
                        .filter(
                            id =>
                                Number.isFinite(id)
                        );

                const uniqueSubmittedIds =
                    [
                        ...new Set(
                            submittedIds
                        )
                    ];

                console.log(
                    "Submitted Assignment IDs:",
                    uniqueSubmittedIds
                );

                setSubmittedAssignmentIds(
                    uniqueSubmittedIds
                );

            } catch (submissionError) {

                console.error(
                    "Unable to load student submissions:",
                    submissionError
                );

                /*
                 * If submissions cannot be loaded,
                 * don't incorrectly show assignments
                 * as submitted.
                 */

                setSubmittedAssignmentIds([]);

            }

        } catch (error) {

            console.error(
                "Unable to load student assignments:",
                error
            );

            setAssignments([]);

            setSubmittedAssignmentIds([]);

            alert(
                "Unable to load your assignments."
            );

        } finally {

            setLoading(false);

        }

    };

    // =====================================================
    // DELETE ASSIGNMENT
    // =====================================================

    const handleDelete = async (
        id
    ) => {

        if (
            !window.confirm(
                "Delete this assignment?"
            )
        ) {

            return;

        }

        try {

            await AssignmentService.deleteAssignment(
                id
            );

            alert(
                "Assignment deleted successfully."
            );

            if (
                isStudent &&
                studentId
            ) {

                loadStudentAssignments();

            } else {

                loadAssignments();

            }

        } catch (error) {

            console.error(
                "Delete failed:",
                error
            );

            alert(
                "Delete failed."
            );

        }

    };

    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {

        setSearch("");

        setTopicFilter("");

        setStatusFilter(
            "ALL"
        );

        setSortOrder(
            "ASC"
        );

    };

    // =====================================================
    // TODAY
    // =====================================================

    const today =
        new Date();

    // =====================================================
    // FILTER ASSIGNMENTS
    // =====================================================

    const filteredAssignments =
        [...assignments]

            .filter(
                assignment => {

                    // =========================================
                    // SEARCH
                    // =========================================

                    const searchMatch =
                        !search.trim() ||

                        assignment?.title
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            ) ||

                        assignment?.description
                            ?.toLowerCase()
                            .includes(
                                search.toLowerCase()
                            );

                    // =========================================
                    // TOPIC
                    // =========================================

                    const assignmentTopicId =
                        assignment?.topicId ??
                        assignment?.topic?.id;

                    const topicMatch =
                        topicFilter === "" ||

                        Number(
                            assignmentTopicId
                        ) ===
                        Number(
                            topicFilter
                        );

                    // =========================================
                    // STATUS
                    // =========================================

                    const dueDate =
                        assignment?.dueDate
                            ? new Date(
                                assignment.dueDate
                            )
                            : null;

                    const statusMatch =
                        statusFilter === "ALL"

                            ? true

                            : statusFilter === "ACTIVE"

                                ? (
                                    dueDate &&
                                    dueDate >= today
                                )

                                : (
                                    dueDate &&
                                    dueDate < today
                                );

                    return (
                        searchMatch &&
                        topicMatch &&
                        statusMatch
                    );

                }
            )

            // =================================================
            // SORT
            // =================================================

            .sort(
                (a, b) => {

                    const dateA =
                        a?.dueDate
                            ? new Date(
                                a.dueDate
                            )
                            : new Date(0);

                    const dateB =
                        b?.dueDate
                            ? new Date(
                                b.dueDate
                            )
                            : new Date(0);

                    if (
                        sortOrder === "ASC"
                    ) {

                        return (
                            dateA - dateB
                        );

                    }

                    return (
                        dateB - dateA
                    );

                }
            );

    // =====================================================
    // TOPIC FILTER OPTIONS
    // =====================================================

    const topicOptions = [
        ...new Map(

            assignments

                .filter(
                    assignment =>
                        assignment?.topic ||
                        assignment?.topicId
                )

                .map(
                    assignment => {

                        const topic =
                            assignment?.topic;

                        const topicId =
                            assignment?.topicId ??
                            topic?.id;

                        const topicTitle =
                            assignment?.topicTitle ??
                            topic?.title ??
                            "Unknown Topic";

                        return [
                            topicId,
                            {
                                id: topicId,
                                title: topicTitle
                            }
                        ];

                    }
                )

        ).values()
    ];

    // =====================================================
    // CHECK WHETHER SUBMITTED
    // =====================================================

    const isAssignmentSubmitted = (
        assignmentId
    ) => {

        return submittedAssignmentIds.includes(
            Number(assignmentId)
        );

    };

    // =====================================================
    // CHECK RESUBMISSION
    // =====================================================

    const isResubmissionAllowed = (
        assignment
    ) => {

        /*
         * Backend should return:
         *
         * allowResubmission
         *
         * true  = student can submit again
         * false = student cannot submit again
         */

        return (
            assignment?.allowResubmission === true
        );

    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <DashboardLayout>

                <div className="container mt-4">

                    <div className="text-center py-5">

                        <div
                            className="spinner-border"
                            role="status"
                        />

                        <p className="mt-2">

                            Loading assignments...

                        </p>

                    </div>

                </div>

            </DashboardLayout>

        );

    }

    // =====================================================
    // RETURN
    // =====================================================

    return (

        <DashboardLayout>

            <div className="container mt-4">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div
                    className="d-flex justify-content-between align-items-center mb-3"
                >

                    <div>

                        <h2>
                            Assignments
                        </h2>

                        {isStudent && (

                            <p className="text-muted mb-0">

                                Showing assignments only from
                                your enrolled courses.

                            </p>

                        )}

                    </div>

                    {/* ================================================= */}
                    {/* ADD ASSIGNMENT */}
                    {/* ================================================= */}

                    {!isStudent && (

                        <Link
                            to="/assignments/add"
                            className="btn btn-success"
                        >

                            Add Assignment

                        </Link>

                    )}

                </div>

                {/* ================================================= */}
                {/* STUDENT MESSAGE */}
                {/* ================================================= */}

                {isStudent && (

                    <div className="alert alert-info">

                        Showing assignments only from your
                        enrolled courses.

                    </div>

                )}

                {/* ================================================= */}
                {/* CARD */}
                {/* ================================================= */}

                <div className="card shadow">

                    <div className="card-body">

                        {/* ================================================= */}
                        {/* SEARCH */}
                        {/* ================================================= */}

                        <div className="mb-3">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search Assignment..."
                                value={search}
                                onChange={
                                    (e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                }
                            />

                        </div>

                        {/* ================================================= */}
                        {/* FILTERS */}
                        {/* ================================================= */}

                        <div className="row mb-3">

                            {/* TOPIC */}

                            <div className="col-md-3">

                                <label className="form-label">

                                    Topic

                                </label>

                                <select
                                    className="form-select"
                                    value={topicFilter}
                                    onChange={
                                        (e) =>
                                            setTopicFilter(
                                                e.target.value
                                            )
                                    }
                                >

                                    <option value="">

                                        All Topics

                                    </option>

                                    {topicOptions.map(
                                        topic => (

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

                            {/* STATUS */}

                            <div className="col-md-3">

                                <label className="form-label">

                                    Status

                                </label>

                                <select
                                    className="form-select"
                                    value={statusFilter}
                                    onChange={
                                        (e) =>
                                            setStatusFilter(
                                                e.target.value
                                            )
                                    }
                                >

                                    <option value="ALL">

                                        All

                                    </option>

                                    <option value="ACTIVE">

                                        Active

                                    </option>

                                    <option value="EXPIRED">

                                        Expired

                                    </option>

                                </select>

                            </div>

                            {/* SORT */}

                            <div className="col-md-3">

                                <label className="form-label">

                                    Sort

                                </label>

                                <select
                                    className="form-select"
                                    value={sortOrder}
                                    onChange={
                                        (e) =>
                                            setSortOrder(
                                                e.target.value
                                            )
                                    }
                                >

                                    <option value="ASC">

                                        Due Date (Oldest)

                                    </option>

                                    <option value="DESC">

                                        Due Date (Newest)

                                    </option>

                                </select>

                            </div>

                            {/* RESET */}

                            <div className="col-md-3 d-flex align-items-end">

                                <button
                                    type="button"
                                    className="btn btn-secondary w-100"
                                    onClick={
                                        resetFilters
                                    }
                                >

                                    Reset

                                </button>

                            </div>

                        </div>

                        {/* ================================================= */}
                        {/* COUNT */}
                        {/* ================================================= */}

                        <div className="mb-3">

                            <span className="badge bg-primary fs-6">

                                {isStudent
                                    ? "My Assignments"
                                    : "Total Assignments"}

                                {" : "}

                                {
                                    filteredAssignments.length
                                }

                            </span>

                        </div>

                        {/* ================================================= */}
                        {/* TABLE */}
                        {/* ================================================= */}

                        <div className="table-responsive">

                            <table
                                className="table table-bordered table-hover"
                            >

                                <thead className="table-dark">

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Title
                                        </th>

                                        <th>
                                            Topic
                                        </th>

                                        <th>
                                            Due Date
                                        </th>

                                        <th>
                                            Max Marks
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        {/* STUDENT */}

                                        {isStudent && (

                                            <th>
                                                Submission
                                            </th>

                                        )}

                                        {/* ADMIN / TEACHER */}

                                        {!isStudent && (

                                            <th>
                                                Actions
                                            </th>

                                        )}

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredAssignments.length > 0 ? (

                                        filteredAssignments.map(
                                            assignment => {

                                                const dueDate =
                                                    assignment?.dueDate
                                                        ? new Date(
                                                            assignment.dueDate
                                                        )
                                                        : null;

                                                const isActive =
                                                    dueDate &&
                                                    dueDate >= today;

                                                const submitted =
                                                    isAssignmentSubmitted(
                                                        assignment.id
                                                    );

                                                const resubmissionAllowed =
                                                    isResubmissionAllowed(
                                                        assignment
                                                    );

                                                return (

                                                    <tr
                                                        key={
                                                            assignment.id
                                                        }
                                                    >

                                                        {/* ID */}

                                                        <td>

                                                            {
                                                                assignment.id
                                                            }

                                                        </td>

                                                        {/* TITLE */}

                                                        <td>

                                                            <strong>

                                                                {
                                                                    assignment.title
                                                                }

                                                            </strong>

                                                            {assignment.description && (

                                                                <div className="small text-muted mt-1">

                                                                    {
                                                                        assignment.description
                                                                    }

                                                                </div>

                                                            )}

                                                        </td>

                                                        {/* TOPIC */}

                                                        <td>

                                                            {
                                                                assignment?.topicTitle ??
                                                                assignment?.topic?.title ??
                                                                "N/A"
                                                            }

                                                        </td>

                                                        {/* DUE DATE */}

                                                        <td>

                                                            {
                                                                assignment.dueDate
                                                                    ? assignment.dueDate
                                                                    : "-"
                                                            }

                                                        </td>

                                                        {/* MAX MARKS */}

                                                        <td>

                                                            {
                                                                assignment.maxMarks ??
                                                                "-"
                                                            }

                                                        </td>

                                                        {/* STATUS */}

                                                        <td>

                                                            {isActive ? (

                                                                <span className="badge bg-success">

                                                                    Active

                                                                </span>

                                                            ) : (

                                                                <span className="badge bg-danger">

                                                                    Expired

                                                                </span>

                                                            )}

                                                        </td>

                                                        {/* ================================================= */}
                                                        {/* STUDENT SUBMISSION */}
                                                        {/* ================================================= */}

                                                        {isStudent && (

                                                            <td>

                                                                {/* ========================================= */}
                                                                {/* ALREADY SUBMITTED */}
                                                                {/* ========================================= */}

                                                                {submitted ? (

                                                                    resubmissionAllowed ? (

                                                                        <Link
                                                                            to={`/submissions/add?assignmentId=${assignment.id}`}
                                                                            className="btn btn-warning btn-sm"
                                                                        >

                                                                            Resubmit Assignment

                                                                        </Link>

                                                                    ) : (

                                                                        <span className="badge bg-success fs-6">

                                                                            ✓ Submitted

                                                                        </span>

                                                                    )

                                                                ) : (

                                                                    /* ===================================== */
                                                                    /* NOT SUBMITTED */
                                                                    /* ===================================== */

                                                                    isActive ? (

                                                                        <Link
                                                                            to={`/submissions/add?assignmentId=${assignment.id}`}
                                                                            className="btn btn-primary btn-sm"
                                                                        >

                                                                            Submit Assignment

                                                                        </Link>

                                                                    ) : (

                                                                        <span className="text-muted">

                                                                            Submission Closed

                                                                        </span>

                                                                    )

                                                                )}

                                                            </td>

                                                        )}

                                                        {/* ================================================= */}
                                                        {/* ADMIN / TEACHER ACTIONS */}
                                                        {/* ================================================= */}

                                                        {!isStudent && (

                                                            <td>

                                                                <Link
                                                                    to={`/assignments/edit/${assignment.id}`}
                                                                    className="btn btn-warning btn-sm me-2"
                                                                >

                                                                    Edit

                                                                </Link>

                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            assignment.id
                                                                        )
                                                                    }
                                                                >

                                                                    Delete

                                                                </button>

                                                            </td>

                                                        )}

                                                    </tr>

                                                );

                                            }
                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan={
                                                    isStudent
                                                        ? 7
                                                        : 7
                                                }
                                                className="text-center py-4"
                                            >

                                                {isStudent

                                                    ? "No assignments are available for your enrolled courses."

                                                    : "No assignments found."

                                                }

                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default AssignmentList;