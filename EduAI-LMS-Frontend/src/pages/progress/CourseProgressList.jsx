import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import CourseProgressService from "../../services/CourseProgressService";

function CourseProgressList() {

    const [progressList, setProgressList] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    // =====================================================
    // GET LOGGED-IN STUDENT ID
    // =====================================================

    const getStudentId = () => {

        // Try common user storage
        const storedUser =
            localStorage.getItem("user");

        if (storedUser) {

            try {

                const user =
                    JSON.parse(storedUser);

                return (
                    user.id ||
                    user.userId ||
                    user.studentId
                );

            } catch (error) {

                console.error(
                    "Unable to read stored user",
                    error
                );
            }
        }


        // Try individual localStorage values

        const studentId =
            localStorage.getItem("studentId");

        if (studentId) {
            return studentId;
        }


        const userId =
            localStorage.getItem("userId");

        if (userId) {
            return userId;
        }


        return null;
    };


    // =====================================================
    // LOAD STUDENT PROGRESS
    // =====================================================

    const loadProgress = async () => {

        setLoading(true);

        setError("");

        try {

            const studentId =
                getStudentId();


            if (!studentId) {

                setError(
                    "Student information not found. Please login again."
                );

                setProgressList([]);

                return;
            }


            console.log(
                "Loading progress for student:",
                studentId
            );


            const response =
                await CourseProgressService.getProgressByStudent(
                    studentId
                );


            console.log(
                "Course progress response:",
                response.data
            );


            setProgressList(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Unable to load course progress:",
                error
            );

            setError(
                "Unable to load your course progress."
            );

            setProgressList([]);

        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // LOAD WHEN PAGE OPENS
    // =====================================================

    useEffect(() => {

        loadProgress();

    }, []);


    // =====================================================
    // CALCULATE STATUS
    // =====================================================

    const getStatus = (progress) => {

        const percentage =
            Number(
                progress?.progressPercentage || 0
            );


        if (percentage >= 100) {

            return {
                text: "Completed",
                className: "bg-success"
            };
        }


        if (percentage > 0) {

            return {
                text: "In Progress",
                className: "bg-warning text-dark"
            };
        }


        return {
            text: "Not Started",
            className: "bg-secondary"
        };
    };


    // =====================================================
    // RENDER
    // =====================================================

    return (

        <DashboardLayout>

            <div className="container mt-4">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <h2 className="mb-2">
                                    My Course Progress
                                </h2>

                                <p className="text-muted mb-0">

                                    Track your progress in
                                    enrolled courses.

                                </p>

                            </div>


                            <button
                                className="btn btn-outline-primary"
                                onClick={loadProgress}
                                disabled={loading}
                            >

                                {loading
                                    ? "Loading..."
                                    : "Refresh"}

                            </button>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (

                    <div
                        className="alert alert-danger"
                        role="alert"
                    >

                        {error}

                    </div>

                )}


                {/* ================================================= */}
                {/* TOTAL */}
                {/* ================================================= */}

                {!loading && !error && (

                    <div className="mb-3">

                        <span className="badge bg-primary fs-6">

                            My Courses :{" "}
                            {progressList.length}

                        </span>

                    </div>

                )}


                {/* ================================================= */}
                {/* TABLE */}
                {/* ================================================= */}

                <div className="card shadow">

                    <div className="card-body">

                        {loading ? (

                            <div className="text-center py-5">

                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                >
                                </div>

                                <p className="mt-3">
                                    Loading your course progress...
                                </p>

                            </div>

                        ) : (

                            <>

                                {progressList.length > 0 ? (

                                    <div className="table-responsive">

                                        <table className="table table-bordered table-hover align-middle">

                                            <thead className="table-dark">

                                                <tr>

                                                    <th>
                                                        #
                                                    </th>

                                                    <th>
                                                        Course
                                                    </th>

                                                    <th>
                                                        Completed
                                                    </th>

                                                    <th>
                                                        Total
                                                    </th>

                                                    <th
                                                        style={{
                                                            minWidth: "250px"
                                                        }}
                                                    >
                                                        Progress
                                                    </th>

                                                    <th>
                                                        Status
                                                    </th>

                                                </tr>

                                            </thead>


                                            <tbody>

                                                {progressList.map(
                                                    (progress, index) => {

                                                        const percentage =
                                                            Number(
                                                                progress?.progressPercentage || 0
                                                            );

                                                        const status =
                                                            getStatus(
                                                                progress
                                                            );


                                                        return (

                                                            <tr
                                                                key={
                                                                    progress.id ||
                                                                    `${progress.course?.id}-${index}`
                                                                }
                                                            >

                                                                {/* NUMBER */}

                                                                <td>

                                                                    {index + 1}

                                                                </td>


                                                                {/* COURSE */}

                                                                <td>

                                                                    <strong>

                                                                        {progress.course?.title ||
                                                                            "Course"}

                                                                    </strong>

                                                                    {progress.course?.courseCode && (

                                                                        <div>

                                                                            <small className="text-muted">

                                                                                {
                                                                                    progress.course.courseCode
                                                                                }

                                                                            </small>

                                                                        </div>

                                                                    )}

                                                                </td>


                                                                {/* COMPLETED */}

                                                                <td>

                                                                    <strong>

                                                                        {
                                                                            progress.completedTopics ?? 0
                                                                        }

                                                                    </strong>

                                                                </td>


                                                                {/* TOTAL */}

                                                                <td>

                                                                    <strong>

                                                                        {
                                                                            progress.totalTopics ?? 0
                                                                        }

                                                                    </strong>

                                                                </td>


                                                                {/* PROGRESS */}

                                                                <td>

                                                                    <div className="progress">

                                                                        <div
                                                                            className={
                                                                                percentage >= 100
                                                                                    ? "progress-bar bg-success"
                                                                                    : "progress-bar bg-info"
                                                                            }

                                                                            role="progressbar"

                                                                            style={{
                                                                                width: `${Math.min(
                                                                                    Math.max(
                                                                                        percentage,
                                                                                        0
                                                                                    ),
                                                                                    100
                                                                                )}%`
                                                                            }}
                                                                        >

                                                                            {percentage.toFixed(
                                                                                1
                                                                            )}
                                                                            %

                                                                        </div>

                                                                    </div>

                                                                </td>


                                                                {/* STATUS */}

                                                                <td>

                                                                    <span
                                                                        className={`badge ${status.className}`}
                                                                    >

                                                                        {
                                                                            status.text
                                                                        }

                                                                    </span>

                                                                </td>

                                                            </tr>

                                                        );

                                                    }
                                                )}

                                            </tbody>

                                        </table>

                                    </div>

                                ) : (

                                    <div className="text-center py-5">

                                        <h5 className="text-muted">

                                            No course progress found.

                                        </h5>

                                        <p className="text-muted">

                                            Your course progress will appear here
                                            after you are enrolled in a course.

                                        </p>

                                    </div>

                                )}

                            </>

                        )}

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );
}

export default CourseProgressList;