import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import ReportService from "../../services/ReportService";

function StudentReport() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [loading, setLoading] = useState(true);

    const [lastUpdated, setLastUpdated] =
        useState("");

    const [report, setReport] = useState({
        student: {},

        averageScore: 0,

        attendancePercentage: 0,

        completedCourses: 0,

        totalCourses: 0,

        grades: [],

        attendance: [],

        courseProgress: []
    });


    // =====================================================
    // LOAD REPORT
    // =====================================================

    useEffect(() => {

        if (user?.id) {
            loadReport();
        }

    }, []);


    // =====================================================
    // GET STUDENT REPORT
    // =====================================================

    const loadReport = () => {

        if (!user?.id) {
            console.error(
                "Student ID not found in localStorage"
            );

            setLoading(false);

            return;
        }

        setLoading(true);

        ReportService
            .getStudentReport(user.id)

            .then((response) => {

                console.log(
                    "STUDENT REPORT RESPONSE:",
                    response.data
                );

                setReport({
                    student:
                        response.data?.student || {},

                    averageScore:
                        Number(
                            response.data?.averageScore || 0
                        ),

                    attendancePercentage:
                        Number(
                            response.data?.attendancePercentage || 0
                        ),

                    completedCourses:
                        Number(
                            response.data?.completedCourses || 0
                        ),

                    totalCourses:
                        Number(
                            response.data?.totalCourses || 0
                        ),

                    grades:
                        Array.isArray(
                            response.data?.grades
                        )
                            ? response.data.grades
                            : [],

                    attendance:
                        Array.isArray(
                            response.data?.attendance
                        )
                            ? response.data.attendance
                            : [],

                    courseProgress:
                        Array.isArray(
                            response.data?.courseProgress
                        )
                            ? response.data.courseProgress
                            : []
                });

                setLastUpdated(
                    new Date().toLocaleString()
                );

            })

            .catch((error) => {

                console.error(
                    "Failed to load student report:",
                    error
                );

            })

            .finally(() => {

                setLoading(false);

            });
    };


    // =====================================================
    // HELPERS
    // =====================================================

    const formatPercentage = (value) => {

        const number = Number(value || 0);

        return number.toFixed(2);
    };


    const getGradePercentage = (grade) => {

        if (
            grade?.percentage !== undefined &&
            grade?.percentage !== null
        ) {
            return Number(
                grade.percentage
            ).toFixed(2);
        }

        const score =
            Number(grade?.score || 0);

        const maxScore =
            Number(grade?.maxScore || 0);

        if (maxScore <= 0) {
            return "0.00";
        }

        return (
            (score / maxScore) * 100
        ).toFixed(2);
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
                            className="spinner-border text-primary"
                            role="status"
                        >
                        </div>

                        <p className="mt-3">
                            Loading student report...
                        </p>

                    </div>

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

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2>
                            My Performance Report
                        </h2>

                        <small className="text-muted">

                            Last Updated :{" "}

                            {lastUpdated || "-"}

                        </small>

                    </div>


                    <button
                        className="btn btn-primary"
                        onClick={loadReport}
                    >

                        <i className="bi bi-arrow-clockwise me-2"></i>

                        Refresh

                    </button>

                </div>


                {/* =====================================================
                    SUMMARY CARDS
                ===================================================== */}

                <div className="row mb-4">

                    {/* ================= AVERAGE GRADE ================= */}

                    <div className="col-lg-4 mb-3">

                        <div className="card border-primary shadow">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <h6>
                                            Average Grade
                                        </h6>

                                        <h2 className="text-primary">

                                            {formatPercentage(
                                                report.averageScore
                                            )}
                                            %

                                        </h2>

                                    </div>


                                    <i
                                        className="bi bi-journal-check text-primary"
                                        style={{
                                            fontSize: "45px"
                                        }}
                                    ></i>

                                </div>


                                <div className="progress mt-3">

                                    <div
                                        className="progress-bar bg-primary"
                                        style={{
                                            width:
                                                Math.min(
                                                    Math.max(
                                                        report.averageScore,
                                                        0
                                                    ),
                                                    100
                                                ) + "%"
                                        }}
                                    >
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================= ATTENDANCE ================= */}

                    <div className="col-lg-4 mb-3">

                        <div className="card border-success shadow">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <h6>
                                            Attendance
                                        </h6>

                                        <h2 className="text-success">

                                            {formatPercentage(
                                                report.attendancePercentage
                                            )}
                                            %

                                        </h2>

                                    </div>


                                    <i
                                        className="bi bi-calendar-check text-success"
                                        style={{
                                            fontSize: "45px"
                                        }}
                                    ></i>

                                </div>


                                <div className="progress mt-3">

                                    <div
                                        className="progress-bar bg-success"
                                        style={{
                                            width:
                                                Math.min(
                                                    Math.max(
                                                        report.attendancePercentage,
                                                        0
                                                    ),
                                                    100
                                                ) + "%"
                                        }}
                                    >
                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================= COMPLETED COURSES ================= */}

                    <div className="col-lg-4 mb-3">

                        <div className="card border-danger shadow">

                            <div className="card-body">

                                <div className="d-flex justify-content-between">

                                    <div>

                                        <h6>
                                            Completed Courses
                                        </h6>

                                        <h2 className="text-danger">

                                            {report.completedCourses}

                                        </h2>

                                    </div>


                                    <i
                                        className="bi bi-award text-danger"
                                        style={{
                                            fontSize: "45px"
                                        }}
                                    ></i>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    GRADES
                ===================================================== */}

                <div className="card shadow mb-4">

                    <div className="card-header bg-primary text-white">

                        <h4 className="mb-0">
                            Grades
                        </h4>

                    </div>


                    <div className="card-body table-responsive">

                        <table className="table table-bordered table-hover">

                            <thead className="table-dark">

                                <tr>

                                    <th>
                                        Course
                                    </th>

                                    <th>
                                        Assignment
                                    </th>

                                    <th>
                                        Quiz
                                    </th>

                                    <th>
                                        Score
                                    </th>

                                    <th>
                                        Max Score
                                    </th>

                                    <th>
                                        %
                                    </th>

                                    <th>
                                        Remarks
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {report.grades.length > 0 ? (

                                    report.grades.map(
                                        (grade, index) => (

                                            <tr
                                                key={
                                                    grade.id ||
                                                    index
                                                }
                                            >

                                                {/* ================= COURSE ================= */}

                                                <td>

                                                    {grade.courseTitle ||
                                                        "-"}

                                                </td>


                                                {/* ================= ASSIGNMENT ================= */}

                                                <td>

                                                    {grade.assignmentTitle ||
                                                        "-"}

                                                </td>


                                                {/* ================= QUIZ ================= */}

                                                <td>

                                                    {grade.quizTitle ||
                                                        "-"}

                                                </td>


                                                {/* ================= SCORE ================= */}

                                                <td>

                                                    {grade.score ??
                                                        "-"}

                                                </td>


                                                {/* ================= MAX SCORE ================= */}

                                                <td>

                                                    {grade.maxScore ??
                                                        "-"}

                                                </td>


                                                {/* ================= PERCENTAGE ================= */}

                                                <td>

                                                    {getGradePercentage(
                                                        grade
                                                    )}
                                                    %

                                                </td>


                                                {/* ================= REMARKS ================= */}

                                                <td>

                                                    {grade.remarks ||
                                                        "-"}

                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center"
                                        >

                                            No grades available.

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* =====================================================
                    ATTENDANCE
                ===================================================== */}

                <div className="card shadow mb-4">

                    <div className="card-header bg-success text-white">

                        <h4 className="mb-0">
                            Attendance
                        </h4>

                    </div>


                    <div className="card-body table-responsive">

                        <table className="table table-bordered table-hover">

                            <thead className="table-dark">

                                <tr>

                                    <th>
                                        Course
                                    </th>

                                    <th>
                                        Date
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Remarks
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {report.attendance.length > 0 ? (

                                    report.attendance.map(
                                        (attendance, index) => (

                                            <tr
                                                key={
                                                    attendance.id ||
                                                    index
                                                }
                                            >

                                                {/* ================= COURSE ================= */}

                                                <td>

                                                    {attendance.courseTitle ||
                                                        "-"}

                                                </td>


                                                {/* ================= DATE ================= */}

                                                <td>

                                                    {attendance.date ||
                                                        "-"}

                                                </td>


                                                {/* ================= STATUS ================= */}

                                                <td>

                                                    <span
                                                        className={
                                                            `badge ${
                                                                attendance.status ===
                                                                "PRESENT"

                                                                    ? "bg-success"

                                                                    : attendance.status ===
                                                                      "ABSENT"

                                                                    ? "bg-danger"

                                                                    : attendance.status ===
                                                                      "EXCUSED"

                                                                    ? "bg-info"

                                                                    : "bg-warning text-dark"
                                                            }`
                                                        }
                                                    >

                                                        {attendance.status ||
                                                            "-"}

                                                    </span>

                                                </td>


                                                {/* ================= REMARKS ================= */}

                                                <td>

                                                    {attendance.remarks ||
                                                        "-"}

                                                </td>

                                            </tr>

                                        )
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            className="text-center"
                                        >

                                            No attendance records.

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>


                {/* =====================================================
                    COURSE PROGRESS
                ===================================================== */}

                <div className="card shadow mb-4">

                    <div className="card-header bg-info text-white">

                        <h4 className="mb-0">
                            Course Progress
                        </h4>

                    </div>


                    <div className="card-body table-responsive">

                        <table className="table table-bordered table-hover">

                            <thead className="table-dark">

                                <tr>

                                    <th>
                                        Course
                                    </th>

                                    <th>
                                        Progress
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {report.courseProgress.length > 0 ? (

                                    report.courseProgress.map(
                                        (progress, index) => {

                                            const progressValue =
                                                Number(
                                                    progress.progress ??
                                                    progress.progressPercentage ??
                                                    0
                                                );

                                            const completed =
                                                progress.completed ===
                                                true ||
                                                progressValue >=
                                                100;

                                            return (

                                                <tr
                                                    key={
                                                        progress.courseId ||
                                                        progress.id ||
                                                        index
                                                    }
                                                >

                                                    {/* ================= COURSE ================= */}

                                                    <td>

                                                        {progress.courseTitle ||
                                                            "-"}

                                                    </td>


                                                    {/* ================= PROGRESS ================= */}

                                                    <td>

                                                        <div className="progress">

                                                            <div
                                                                className="progress-bar bg-info"
                                                                style={{
                                                                    width:
                                                                        Math.min(
                                                                            Math.max(
                                                                                progressValue,
                                                                                0
                                                                            ),
                                                                            100
                                                                        ) +
                                                                        "%"
                                                                }}
                                                            >

                                                                {progressValue}%

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* ================= STATUS ================= */}

                                                    <td>

                                                        <span
                                                            className={
                                                                `badge ${
                                                                    completed
                                                                        ? "bg-success"
                                                                        : "bg-warning text-dark"
                                                                }`
                                                            }
                                                        >

                                                            {completed
                                                                ? "Completed"
                                                                : "In Progress"}

                                                        </span>

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="3"
                                            className="text-center"
                                        >

                                            No progress records.

                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default StudentReport;