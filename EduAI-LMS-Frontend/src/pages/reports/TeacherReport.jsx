import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ReportService from "../../services/ReportService";

function TeacherReport() {

    const user = JSON.parse(localStorage.getItem("user"));

    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        totalAssignments: 0,
        totalQuizzes: 0,
        averageGrade: 0,
        attendancePercentage: 0
    });

    useEffect(() => {
        loadReport();
    }, []);

    const loadReport = () => {

        setLoading(true);

        ReportService.getTeacherReport(user.id)
            .then((response) => {

                setStats(response.data);

            })
            .catch((error) => {

                console.error(error);

                alert("Unable to load report.");

            })
            .finally(() => {

                setLoading(false);

            });

    };

    const cards = [

        {
            title: "Courses",
            value: stats.totalCourses,
            color: "primary",
            icon: "bi-book"
        },

        {
            title: "Students",
            value: stats.totalStudents,
            color: "success",
            icon: "bi-people-fill"
        },

        {
            title: "Assignments",
            value: stats.totalAssignments,
            color: "warning",
            icon: "bi-file-earmark-text"
        },

        {
            title: "Quizzes",
            value: stats.totalQuizzes,
            color: "info",
            icon: "bi-patch-question"
        },

        {
            title: "Average Grade",
            value: `${stats.averageGrade.toFixed(2)}%`,
            color: "danger",
            icon: "bi-journal-check",
            progress: stats.averageGrade
        },

        {
            title: "Attendance",
            value: `${stats.attendancePercentage.toFixed(2)}%`,
            color: "secondary",
            icon: "bi-calendar-check",
            progress: stats.attendancePercentage
        }

    ];

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h2>Teacher Analytics</h2>

                    <button
                        className="btn btn-primary"
                        onClick={loadReport}
                    >
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh
                    </button>

                </div>

                {loading ? (

                    <div className="text-center">

                        <div className="spinner-border text-primary"></div>

                    </div>

                ) : (

                    <div className="row">

                        {cards.map((card) => (

                            <div
                                key={card.title}
                                className="col-lg-4 col-md-6 mb-4"
                            >

                                <div className={`card shadow border-${card.color}`}>

                                    <div className="card-body">

                                        <div className="d-flex justify-content-between align-items-center">

                                            <div>

                                                <h6>{card.title}</h6>

                                                <h2 className={`text-${card.color}`}>
                                                    {card.value}
                                                </h2>

                                            </div>

                                            <i
                                                className={`bi ${card.icon} text-${card.color}`}
                                                style={{ fontSize: "45px" }}
                                            ></i>

                                        </div>

                                        {card.progress !== undefined && (

                                            <div className="progress mt-3">

                                                <div
                                                    className={`progress-bar bg-${card.color}`}
                                                    style={{
                                                        width: `${card.progress}%`
                                                    }}
                                                ></div>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </DashboardLayout>

    );

}

export default TeacherReport;