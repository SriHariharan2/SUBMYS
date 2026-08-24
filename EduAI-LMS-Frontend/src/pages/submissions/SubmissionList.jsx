import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";

import AssignmentService from "../../services/AssignmentService";
import UserService from "../../services/UserService";
import AssignmentSubmissionService from "../../services/AssignmentSubmissionService";


function SubmissionList() {

    // =====================================================
    // STATE
    // =====================================================

    const [submissions, setSubmissions] = useState([]);

    const [students, setStudents] = useState([]);

    const [assignments, setAssignments] = useState([]);

    const [search, setSearch] = useState("");

    const [selectedStudent, setSelectedStudent] = useState("");

    const [selectedAssignment, setSelectedAssignment] = useState("");

    const [selectedStatus, setSelectedStatus] = useState("");

    const [loading, setLoading] = useState(false);


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadStudents();

        loadAssignments();

        loadSubmissions();

    }, []);


    // =====================================================
    // LOAD STUDENTS
    // =====================================================

    const loadStudents = () => {

        UserService.getUsersByRole("STUDENT")

            .then((response) => {

                console.log(
                    "STUDENTS RESPONSE:",
                    response.data
                );

                setStudents(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            })

            .catch((error) => {

                console.error(
                    "FAILED TO LOAD STUDENTS:",
                    error
                );

                setStudents([]);

            });

    };


    // =====================================================
    // LOAD ASSIGNMENTS
    // =====================================================

    const loadAssignments = () => {

        AssignmentService.getAllAssignments()

            .then((response) => {

                console.log(
                    "ASSIGNMENTS RESPONSE:",
                    response.data
                );

                setAssignments(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            })

            .catch((error) => {

                console.error(
                    "FAILED TO LOAD ASSIGNMENTS:",
                    error
                );

                setAssignments([]);

            });

    };


    // =====================================================
    // LOAD SUBMISSIONS
    // =====================================================

    const loadSubmissions = () => {

        setLoading(true);

        console.log(
            "======================================"
        );

        console.log(
            "LOADING ASSIGNMENT SUBMISSIONS"
        );

        console.log(
            "======================================"
        );


        AssignmentSubmissionService
            .getAllSubmissions()

            .then((response) => {

                console.log(
                    "ADMIN SUBMISSION RESPONSE:",
                    response
                );

                console.log(
                    "ADMIN SUBMISSION DATA:",
                    response.data
                );


                const data = Array.isArray(response.data)
                    ? response.data
                    : [];


                setSubmissions(data);

            })

            .catch((error) => {

                console.error(
                    "FAILED TO LOAD SUBMISSIONS:",
                    error
                );

                console.error(
                    "STATUS:",
                    error.response?.status
                );

                console.error(
                    "RESPONSE:",
                    error.response?.data
                );

                setSubmissions([]);

            })

            .finally(() => {

                setLoading(false);

            });

    };


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {
            return "-";
        }

        try {

            return new Date(date).toLocaleString();

        } catch {

            return date;

        }

    };


    // =====================================================
    // GET STUDENT NAME
    // =====================================================

    const getStudentName = (submission) => {

        if (submission.student?.fullName) {

            return submission.student.fullName;

        }


        if (submission.student?.name) {

            return submission.student.name;

        }


        if (submission.student?.username) {

            return submission.student.username;

        }


        if (submission.student?.email) {

            return submission.student.email;

        }


        if (submission.studentId) {

            const student = students.find(
                s => Number(s.id) === Number(submission.studentId)
            );

            if (student) {

                return (
                    student.fullName ||
                    student.name ||
                    student.email ||
                    `Student ${student.id}`
                );

            }

        }


        return "-";

    };


    // =====================================================
    // GET ASSIGNMENT
    // =====================================================

    const getAssignment = (submission) => {

        const assignmentId =
            submission.assignment?.id ||
            submission.assignmentId;

        if (!assignmentId) {
            return null;
        }


        // First check assignment object returned
        // inside submission

        if (submission.assignment) {

            return submission.assignment;

        }


        // Otherwise find it from loaded assignments

        const assignment = assignments.find(
            a => Number(a.id) === Number(assignmentId)
        );

        return assignment || null;

    };


    // =====================================================
    // GET ASSIGNMENT TITLE
    // =====================================================

    const getAssignmentTitle = (submission) => {

        const assignment = getAssignment(submission);


        if (assignment?.title) {

            return assignment.title;

        }


        if (assignment?.name) {

            return assignment.name;

        }


        if (submission.assignmentId) {

            return `Assignment ${submission.assignmentId}`;

        }


        return "-";

    };


    // =====================================================
    // GET MAXIMUM MARKS
    // =====================================================

    const getMaxMarks = (submission) => {

        const assignment = getAssignment(submission);

        if (!assignment) {
            return null;
        }


        /*
         * Supports different possible backend
         * property names.
         *
         * Preferred:
         * maxMarks
         *
         * Also supports:
         * totalMarks
         * maximumMarks
         * marks
         */

        const maxMarks =
            assignment.maxMarks ??
            assignment.totalMarks ??
            assignment.maximumMarks ??
            assignment.marks;


        if (
            maxMarks === null ||
            maxMarks === undefined ||
            maxMarks === ""
        ) {

            return null;

        }


        return Number(maxMarks);

    };


    // =====================================================
    // GET STATUS
    // =====================================================

    const getStatus = (submission) => {

        if (submission.status) {

            return submission.status;

        }


        // If marks exist, consider it graded

        if (
            submission.marks !== null &&
            submission.marks !== undefined
        ) {

            return "GRADED";

        }


        return "SUBMITTED";

    };


    // =====================================================
    // STATUS BADGE
    // =====================================================

    const statusBadge = (status) => {

        switch (status) {

            case "GRADED":

                return "bg-success";


            case "SUBMITTED":

                return "bg-primary";


            case "PENDING":

                return "bg-warning text-dark";


            case "LATE":

                return "bg-danger";


            default:

                return "bg-secondary";

        }

    };


    // =====================================================
    // FILTER SUBMISSIONS
    // =====================================================

    const filteredSubmissions = submissions.filter(
        (submission) => {

            const studentName =
                getStudentName(submission).toLowerCase();


            const assignmentTitle =
                getAssignmentTitle(submission).toLowerCase();


            const searchText =
                search.toLowerCase();


            // Search

            const matchesSearch =
                !searchText ||
                studentName.includes(searchText) ||
                assignmentTitle.includes(searchText);


            // Student filter

            const matchesStudent =
                !selectedStudent ||
                Number(
                    submission.student?.id ||
                    submission.studentId
                ) === Number(selectedStudent);


            // Assignment filter

            const matchesAssignment =
                !selectedAssignment ||
                Number(
                    submission.assignment?.id ||
                    submission.assignmentId
                ) === Number(selectedAssignment);


            // Status filter

            const status =
                getStatus(submission);


            const matchesStatus =
                !selectedStatus ||
                status === selectedStatus;


            return (
                matchesSearch &&
                matchesStudent &&
                matchesAssignment &&
                matchesStatus
            );

        }
    );


    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {

        setSearch("");

        setSelectedStudent("");

        setSelectedAssignment("");

        setSelectedStatus("");

    };


    // =====================================================
    // DELETE SUBMISSION
    // =====================================================

    const handleDelete = (id) => {

        if (
            !window.confirm(
                "Are you sure you want to delete this submission?"
            )
        ) {

            return;

        }


        AssignmentSubmissionService
            .deleteSubmission(id)

            .then(() => {

                alert(
                    "Submission deleted successfully."
                );

                loadSubmissions();

            })

            .catch((error) => {

                console.error(
                    "DELETE SUBMISSION ERROR:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    "Unable to delete submission."
                );

            });

    };


    // =====================================================
    // GRADE SUBMISSION
    // =====================================================

    const handleGrade = (submission) => {

        console.log(
            "======================================"
        );

        console.log(
            "GRADING SUBMISSION"
        );

        console.log(
            "SUBMISSION:",
            submission
        );


        // -------------------------------------------------
        // GET ASSIGNMENT
        // -------------------------------------------------

        const assignment =
            getAssignment(submission);


        console.log(
            "ASSIGNMENT:",
            assignment
        );


        // -------------------------------------------------
        // GET MAXIMUM MARKS
        // -------------------------------------------------

        const maxMarks =
            getMaxMarks(submission);


        console.log(
            "MAXIMUM MARKS:",
            maxMarks
        );


        // -------------------------------------------------
        // CHECK MAX MARKS
        // -------------------------------------------------

        if (
            maxMarks === null ||
            Number.isNaN(maxMarks)
        ) {

            alert(
                "Maximum marks are not available for this assignment."
            );

            return;

        }


        // -------------------------------------------------
        // CURRENT MARKS
        // -------------------------------------------------

        const currentMarks =
            submission.marks ?? "";


        // -------------------------------------------------
        // CURRENT FEEDBACK
        // -------------------------------------------------

        const currentFeedback =
            submission.feedback ?? "";


        // -------------------------------------------------
        // ENTER MARKS
        // -------------------------------------------------

        const marks = window.prompt(
            `Enter marks (Maximum: ${maxMarks}):`,
            currentMarks
        );


        // User pressed Cancel

        if (marks === null) {

            return;

        }


        // -------------------------------------------------
        // VALIDATE EMPTY / NUMBER
        // -------------------------------------------------

        if (
            marks.trim() === "" ||
            isNaN(marks)
        ) {

            alert(
                "Please enter valid marks."
            );

            return;

        }


        const numericMarks =
            Number(marks);


        // -------------------------------------------------
        // VALIDATE NEGATIVE
        // -------------------------------------------------

        if (numericMarks < 0) {

            alert(
                "Marks cannot be negative."
            );

            return;

        }


        // -------------------------------------------------
        // VALIDATE MAXIMUM
        // -------------------------------------------------

        if (
            numericMarks > maxMarks
        ) {

            alert(
                `Marks cannot be greater than ${maxMarks}.`
            );

            return;

        }


        // -------------------------------------------------
        // ENTER FEEDBACK
        // -------------------------------------------------

        const feedback =
            window.prompt(
                "Enter feedback:",
                currentFeedback
            );


        if (feedback === null) {

            return;

        }


        // -------------------------------------------------
        // SAVE GRADE
        // -------------------------------------------------

        AssignmentSubmissionService
            .gradeSubmission(
                submission.id,
                numericMarks,
                feedback
            )

            .then(() => {

                alert(
                    `Submission graded successfully: ${numericMarks}/${maxMarks}`
                );

                loadSubmissions();

            })

            .catch((error) => {

                console.error(
                    "GRADE SUBMISSION ERROR:",
                    error
                );

                console.error(
                    "STATUS:",
                    error.response?.status
                );

                console.error(
                    "RESPONSE:",
                    error.response?.data
                );


                alert(
                    error.response?.data?.message ||
                    "Unable to grade submission."
                );

            });

    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card shadow">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="card-header d-flex justify-content-between align-items-center">

                        <h2 className="mb-0">

                            Assignment Submissions

                        </h2>


                        <a
                            href="/submissions/add"
                            className="btn btn-primary"
                        >

                            + New Submission

                        </a>

                    </div>


                    <div className="card-body">


                        {/* =================================================
                            SEARCH
                        ================================================= */}

                        <div className="mb-3">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search Student or Assignment..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                        </div>


                        {/* =================================================
                            FILTERS
                        ================================================= */}

                        <div className="row mb-3">


                            {/* STUDENT */}

                            <div className="col-md-4">

                                <label className="form-label">

                                    Student

                                </label>


                                <select
                                    className="form-select"
                                    value={selectedStudent}
                                    onChange={(e) =>
                                        setSelectedStudent(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">

                                        All Students

                                    </option>


                                    {students.map(
                                        (student) => (

                                            <option
                                                key={student.id}
                                                value={student.id}
                                            >

                                                {student.fullName ||
                                                    student.name ||
                                                    student.email}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* ASSIGNMENT */}

                            <div className="col-md-4">

                                <label className="form-label">

                                    Assignment

                                </label>


                                <select
                                    className="form-select"
                                    value={selectedAssignment}
                                    onChange={(e) =>
                                        setSelectedAssignment(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">

                                        All Assignments

                                    </option>


                                    {assignments.map(
                                        (assignment) => (

                                            <option
                                                key={assignment.id}
                                                value={assignment.id}
                                            >

                                                {assignment.title ||
                                                    assignment.name}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* STATUS */}

                            <div className="col-md-2">

                                <label className="form-label">

                                    Status

                                </label>


                                <select
                                    className="form-select"
                                    value={selectedStatus}
                                    onChange={(e) =>
                                        setSelectedStatus(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">

                                        All

                                    </option>


                                    <option value="SUBMITTED">

                                        Submitted

                                    </option>


                                    <option value="GRADED">

                                        Graded

                                    </option>

                                </select>

                            </div>


                            {/* RESET */}

                            <div className="col-md-2 d-flex align-items-end">

                                <button
                                    type="button"
                                    className="btn btn-secondary w-100"
                                    onClick={resetFilters}
                                >

                                    Reset

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            COUNT
                        ================================================= */}

                        <div className="mb-3">

                            <span className="badge bg-primary fs-6">

                                Submissions :{" "}
                                {filteredSubmissions.length}

                            </span>

                        </div>


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div className="table-responsive">

                            <table className="table table-bordered table-hover">

                                <thead className="table-dark">

                                    <tr>

                                        <th>
                                            #
                                        </th>

                                        <th>
                                            Student
                                        </th>

                                        <th>
                                            Assignment
                                        </th>

                                        <th>
                                            Submitted At
                                        </th>

                                        <th>
                                            File
                                        </th>

                                        <th>
                                            Score
                                        </th>

                                        <th>
                                            Feedback
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {loading ? (

                                        <tr>

                                            <td
                                                colSpan="9"
                                                className="text-center"
                                            >

                                                Loading submissions...

                                            </td>

                                        </tr>

                                    ) : filteredSubmissions.length > 0 ? (

                                        filteredSubmissions.map(
                                            (submission, index) => {

                                                const status =
                                                    getStatus(
                                                        submission
                                                    );


                                                const maxMarks =
                                                    getMaxMarks(
                                                        submission
                                                    );


                                                return (

                                                    <tr
                                                        key={
                                                            submission.id ||
                                                            `submission-${index}`
                                                        }
                                                    >


                                                        {/* NUMBER */}

                                                        <td>

                                                            {index + 1}

                                                        </td>


                                                        {/* STUDENT */}

                                                        <td>

                                                            {
                                                                getStudentName(
                                                                    submission
                                                                )
                                                            }

                                                        </td>


                                                        {/* ASSIGNMENT */}

                                                        <td>

                                                            {
                                                                getAssignmentTitle(
                                                                    submission
                                                                )
                                                            }

                                                        </td>


                                                        {/* DATE */}

                                                        <td>

                                                            {
                                                                formatDate(
                                                                    submission.submittedAt
                                                                )
                                                            }

                                                        </td>


                                                        {/* FILE */}

                                                        <td>

                                                            {submission.fileUrl ? (

                                                                <a
                                                                    href={
                                                                        submission.fileUrl
                                                                    }
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-info btn-sm text-white"
                                                                >

                                                                    View File

                                                                </a>

                                                            ) : (

                                                                "-"

                                                            )}

                                                        </td>


                                                        {/* SCORE */}

                                                        <td>

                                                            {submission.marks !== null &&
                                                            submission.marks !== undefined
                                                                ? (

                                                                    <strong>

                                                                        {submission.marks}

                                                                        {maxMarks !== null
                                                                            ? ` / ${maxMarks}`
                                                                            : ""
                                                                        }

                                                                    </strong>

                                                                )
                                                                : (

                                                                    "-"

                                                                )
                                                            }

                                                        </td>


                                                        {/* FEEDBACK */}

                                                        <td>

                                                            {
                                                                submission.feedback ||
                                                                "-"
                                                            }

                                                        </td>


                                                        {/* STATUS */}

                                                        <td>

                                                            <span
                                                                className={`badge ${statusBadge(status)}`}
                                                            >

                                                                {status}

                                                            </span>

                                                        </td>


                                                        {/* ACTIONS */}

                                                        <td>

                                                            <button
                                                                type="button"
                                                                className="btn btn-success btn-sm me-2"
                                                                onClick={() =>
                                                                    handleGrade(
                                                                        submission
                                                                    )
                                                                }
                                                            >

                                                                Grade

                                                            </button>


                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        submission.id
                                                                    )
                                                                }
                                                            >

                                                                Delete

                                                            </button>

                                                        </td>

                                                    </tr>

                                                );

                                            }
                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="9"
                                                className="text-center"
                                            >

                                                No submissions found.

                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>


                        {/* =================================================
                            REFRESH
                        ================================================= */}

                        <button
                            type="button"
                            className="btn btn-outline-primary mt-3"
                            onClick={loadSubmissions}
                        >

                            Refresh Submissions

                        </button>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}


export default SubmissionList;