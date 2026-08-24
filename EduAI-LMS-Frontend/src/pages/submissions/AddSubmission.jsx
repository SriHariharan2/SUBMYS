import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import AssignmentService from "../../services/AssignmentService";
import AssignmentSubmissionService from "../../services/AssignmentSubmissionService";

import { getUser } from "../../utils/localStorage";

function AddSubmission() {

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    // =====================================================
    // ASSIGNMENT ID
    // =====================================================

    const assignmentIdFromUrl =
        searchParams.get("assignmentId");

    // =====================================================
    // LOGGED-IN USER
    // =====================================================

    const user = getUser();

    const studentId =
        user?.id ??
        user?.userId ??
        user?.studentId ??
        null;

    // =====================================================
    // STATE
    // =====================================================

    const [assignment, setAssignment] =
        useState(null);

    const [assignmentId, setAssignmentId] =
        useState(
            assignmentIdFromUrl || ""
        );

    const [fileUrl, setFileUrl] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    // =====================================================
    // LOAD ASSIGNMENT
    // =====================================================

    useEffect(() => {

        if (!assignmentIdFromUrl) {

            setLoading(false);

            return;
        }

        setAssignmentId(
            assignmentIdFromUrl
        );

        loadAssignment(
            assignmentIdFromUrl
        );

    }, [assignmentIdFromUrl]);

    // =====================================================
    // LOAD ASSIGNMENT
    // =====================================================

    const loadAssignment = async (id) => {

        try {

            setLoading(true);

            const response =
                await AssignmentService.getAssignmentById(
                    id
                );

            console.log(
                "Selected Assignment:",
                response.data
            );

            setAssignment(
                response.data
            );

        } catch (error) {

            console.error(
                "Unable to load assignment:",
                error
            );

            alert(
                "Unable to load assignment."
            );

        } finally {

            setLoading(false);

        }

    };

    // =====================================================
    // SUBMIT ASSIGNMENT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        // =================================================
        // CHECK STUDENT
        // =================================================

        if (!studentId) {

            alert(
                "Student information not found. Please login again."
            );

            return;

        }

        // =================================================
        // CHECK ASSIGNMENT
        // =================================================

        if (!assignmentId) {

            alert(
                "Assignment information not found."
            );

            return;

        }

        // =================================================
        // CHECK FILE URL
        // =================================================

        if (!fileUrl.trim()) {

            alert(
                "Please enter your Google Drive/document link."
            );

            return;

        }

        try {

            setSubmitting(true);

            // =================================================
            // IMPORTANT
            // ONLY SEND FIELDS THAT EXIST IN
            // AssignmentSubmission ENTITY
            // =================================================

            const submissionData = {

                fileUrl:
                    fileUrl.trim()

            };

            console.log(
                "===================================="
            );

            console.log(
                "SUBMITTING ASSIGNMENT"
            );

            console.log(
                "Student ID:",
                studentId
            );

            console.log(
                "Assignment ID:",
                assignmentId
            );

            console.log(
                "Submission:",
                submissionData
            );

            // =================================================
            // SAVE TO assignment_submissions
            // =================================================

            const response =
                await AssignmentSubmissionService
                    .submitAssignment(

                        studentId,

                        assignmentId,

                        submissionData

                    );

            console.log(
                "SUBMISSION SUCCESS:",
                response.data
            );

            console.log(
                "===================================="
            );

            alert(
                "Assignment submitted successfully."
            );

            // =================================================
            // GO TO STUDENT SUBMISSIONS
            // =================================================

            navigate(
                "/my-submissions"
            );

        } catch (error) {

            console.error(
                "Submission failed:",
                error
            );

            console.error(
                "Status:",
                error?.response?.status
            );

            console.error(
                "Response:",
                error?.response?.data
            );

            const message =
                error?.response?.data?.message ||
                "Assignment submission failed.";

            alert(message);

        } finally {

            setSubmitting(false);

        }

    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <DashboardLayout>

                <div className="container mt-5">

                    <div className="text-center">

                        <div
                            className="spinner-border"
                            role="status"
                        />

                        <p className="mt-3">
                            Loading assignment...
                        </p>

                    </div>

                </div>

            </DashboardLayout>

        );

    }

    // =====================================================
    // NO ASSIGNMENT
    // =====================================================

    if (!assignmentId) {

        return (

            <DashboardLayout>

                <div className="container mt-4">

                    <div className="alert alert-danger">

                        Assignment was not selected.

                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            navigate(
                                "/assignments"
                            )
                        }
                    >

                        Back to Assignments

                    </button>

                </div>

            </DashboardLayout>

        );

    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h2 className="mb-0">
                            Submit Assignment
                        </h2>

                    </div>

                    <div className="card-body">

                        {/* ============================= */}
                        {/* STUDENT */}
                        {/* ============================= */}

                        <div className="mb-4">

                            <label className="form-label fw-bold">
                                Student
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={
                                    user?.fullName ||
                                    user?.name ||
                                    "Current Student"
                                }
                                readOnly
                            />

                            <div className="form-text">

                                Your student account is
                                automatically selected.

                            </div>

                        </div>


                        {/* ============================= */}
                        {/* ASSIGNMENT */}
                        {/* ============================= */}

                        <div className="mb-4">

                            <label className="form-label fw-bold">
                                Assignment
                            </label>

                            <div className="card bg-light">

                                <div className="card-body">

                                    <h5>

                                        {assignment?.title ||
                                            "Assignment"}

                                    </h5>

                                    {assignment?.description && (

                                        <p>
                                            {
                                                assignment.description
                                            }
                                        </p>

                                    )}

                                    <div className="row">

                                        <div className="col-md-4">

                                            <strong>
                                                Assignment ID:
                                            </strong>

                                            <br />

                                            {
                                                assignment?.id ||
                                                assignmentId
                                            }

                                        </div>

                                        <div className="col-md-4">

                                            <strong>
                                                Due Date:
                                            </strong>

                                            <br />

                                            {
                                                assignment?.dueDate ||
                                                "-"
                                            }

                                        </div>

                                        <div className="col-md-4">

                                            <strong>
                                                Maximum Marks:
                                            </strong>

                                            <br />

                                            {
                                                assignment?.maxMarks ??
                                                "-"
                                            }

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* ============================= */}
                        {/* FORM */}
                        {/* ============================= */}

                        <form
                            onSubmit={
                                handleSubmit
                            }
                        >

                            <div className="mb-4">

                                <label className="form-label fw-bold">

                                    Google Drive /
                                    Document Link

                                </label>

                                <input
                                    type="url"
                                    className="form-control"
                                    placeholder="https://drive.google.com/..."
                                    value={fileUrl}
                                    onChange={(e) =>
                                        setFileUrl(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        submitting
                                    }
                                    required
                                />

                                <div className="form-text">

                                    Upload your assignment
                                    document to Google Drive
                                    and paste the shareable
                                    link here.

                                </div>

                            </div>


                            <div className="alert alert-info">

                                <strong>
                                    Submission instructions
                                </strong>

                                <ul className="mb-0 mt-2">

                                    <li>
                                        Your student account
                                        is selected automatically.
                                    </li>

                                    <li>
                                        This assignment is
                                        selected automatically.
                                    </li>

                                    <li>
                                        Upload your document
                                        to Google Drive.
                                    </li>

                                    <li>
                                        Paste the shareable
                                        Google Drive link above.
                                    </li>

                                    <li>
                                        After submission,
                                        your submission will
                                        appear under
                                        My Submissions.
                                    </li>

                                </ul>

                            </div>


                            <div className="d-flex gap-2">

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={
                                        submitting
                                    }
                                >

                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Assignment"}

                                </button>


                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    disabled={
                                        submitting
                                    }
                                    onClick={() =>
                                        navigate(
                                            "/assignments"
                                        )
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

export default AddSubmission;