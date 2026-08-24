import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import AssignmentService from "../../services/AssignmentService";
import UserService from "../../services/UserService";
import AssignmentSubmissionService from "../../services/AssignmentSubmissionService";

function SubmissionForm() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);

    const [submission, setSubmission] = useState({
        studentId: "",
        assignmentId: "",
        fileUrl: ""
    });

    const [loading, setLoading] = useState(false);

    // =====================================================
    // LOAD STUDENTS + ASSIGNMENTS
    // =====================================================

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            const studentsResponse =
                await UserService.getUsersByRole("STUDENT");

            const assignmentsResponse =
                await AssignmentService.getAllAssignments();

            setStudents(studentsResponse.data || []);
            setAssignments(assignmentsResponse.data || []);

        } catch (error) {

            console.error("LOAD SUBMISSION DATA ERROR:", error);

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "BACKEND:",
                error.response?.data
            );

            alert("Unable to load students or assignments.");

        }

    };

    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (e) => {

        setSubmission({
            ...submission,
            [e.target.name]: e.target.value
        });

    };

    // =====================================================
    // SAVE SUBMISSION
    // =====================================================

    const saveSubmission = async (e) => {

        e.preventDefault();

        if (!submission.studentId) {

            alert("Please select a student.");
            return;

        }

        if (!submission.assignmentId) {

            alert("Please select an assignment.");
            return;

        }

        if (!submission.fileUrl.trim()) {

            alert("Please enter the file URL.");
            return;

        }

        try {

            setLoading(true);

            let fileUrl =
                submission.fileUrl.trim();

            // Add https:// automatically
            if (
                !fileUrl.startsWith("http://") &&
                !fileUrl.startsWith("https://")
            ) {

                fileUrl =
                    "https://" + fileUrl;

            }

            const payload = {

                fileUrl: fileUrl

            };

            console.log(
                "SUBMISSION DATA BEING SENT:"
            );

            console.log(
                "Student ID:",
                submission.studentId
            );

            console.log(
                "Assignment ID:",
                submission.assignmentId
            );

            console.log(
                "Payload:",
                payload
            );

            const response =
                await AssignmentSubmissionService.submitAssignment(
                    submission.studentId,
                    submission.assignmentId,
                    payload
                );

            console.log(
                "SUBMISSION CREATED:",
                response.data
            );

            alert(
                "Assignment Submitted Successfully"
            );

            navigate("/submissions");

        } catch (error) {

            console.error(
                "SUBMISSION ERROR:",
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
                "Submission Failed"
            );

        } finally {

            setLoading(false);

        }

    };

    // =====================================================
    // UI
    // =====================================================

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h3>
                            Submit Assignment
                        </h3>

                    </div>

                    <div className="card-body">

                        <form onSubmit={saveSubmission}>

                            {/* STUDENT */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Student
                                </label>

                                <select
                                    className="form-select"
                                    name="studentId"
                                    value={submission.studentId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Student
                                    </option>

                                    {students.map(student => (

                                        <option
                                            key={student.id}
                                            value={student.id}
                                        >

                                            {student.fullName}

                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* ASSIGNMENT */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Assignment
                                </label>

                                <select
                                    className="form-select"
                                    name="assignmentId"
                                    value={submission.assignmentId}
                                    onChange={handleChange}
                                    required
                                >

                                    <option value="">
                                        Select Assignment
                                    </option>

                                    {assignments.map(assignment => (

                                        <option
                                            key={assignment.id}
                                            value={assignment.id}
                                        >

                                            {assignment.title}

                                        </option>

                                    ))}

                                </select>

                            </div>


                            {/* FILE URL */}

                            <div className="mb-3">

                                <label className="form-label">
                                    File URL
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="fileUrl"
                                    value={submission.fileUrl}
                                    onChange={handleChange}
                                    placeholder="e.g. drive.google.com/file/..."
                                    required
                                />

                                <small className="text-muted">

                                    You can enter the link with or
                                    without https://.

                                </small>

                            </div>


                            {/* BUTTON */}

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >

                                {loading
                                    ? "Submitting..."
                                    : "Submit Assignment"
                                }

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default SubmissionForm;