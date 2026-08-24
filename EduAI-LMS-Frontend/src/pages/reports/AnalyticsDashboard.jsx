import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import ReportService from "../../services/ReportService";

function AnalyticsDashboard() {

    const [summary, setSummary] = useState({

        totalStudents: 0,
        totalTeachers: 0,
        totalGrades: 0,
        totalAttendanceRecords: 0,
        completedCourses: 0

    });

    const [loading, setLoading] = useState(true);

    const [lastUpdated, setLastUpdated] = useState("");

    useEffect(() => {

        loadDashboard();

    }, []);

    const loadDashboard = () => {

        setLoading(true);

        ReportService.getDashboardSummary()

            .then((response) => {

                setSummary(response.data);

                setLastUpdated(
                    new Date().toLocaleString()
                );

            })

            .catch(console.error)

            .finally(() => {

                setLoading(false);

            });

    };

    const totalSystemRecords =

        summary.totalStudents +
        summary.totalTeachers +
        summary.totalGrades +
        summary.totalAttendanceRecords +
        summary.completedCourses;

    const cards = [

        {
            title: "Students",
            value: summary.totalStudents,
            color: "primary",
            icon: "bi-people-fill"
        },

        {
            title: "Teachers",
            value: summary.totalTeachers,
            color: "success",
            icon: "bi-person-workspace"
        },

        {
            title: "Grades",
            value: summary.totalGrades,
            color: "warning",
            icon: "bi-journal-check"
        },

        {
            title: "Attendance",
            value: summary.totalAttendanceRecords,
            color: "info",
            icon: "bi-calendar-check"
        },

        {
            title: "Completed Courses",
            value: summary.completedCourses,
            color: "danger",
            icon: "bi-book"
        }

    ];

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2>

                            Reports & Analytics

                        </h2>

                        <small className="text-muted">

                            Last Updated : {lastUpdated}

                        </small>

                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={loadDashboard}
                    >

                        <i className="bi bi-arrow-clockwise me-2"></i>

                        Refresh

                    </button>

                </div>

                {loading ? (

                    <div className="text-center mt-5">

                        <div className="spinner-border text-primary"></div>

                    </div>

                ) : (

                    <>

                        <div className="row">

                            {cards.map((card) => (

                                <div
                                    key={card.title}
                                    className="col-lg-4 col-md-6 mb-4"
                                >

                                    <div
                                        className={`card border-${card.color} shadow`}
                                    >

                                        <div className="card-body">

                                            <div className="d-flex justify-content-between">

                                                <div>

                                                    <h6>

                                                        {card.title}

                                                    </h6>

                                                    <h2
                                                        className={`text-${card.color}`}
                                                    >

                                                        {card.value}

                                                    </h2>

                                                </div>

                                                <i
                                                    className={`bi ${card.icon} text-${card.color}`}
                                                    style={{
                                                        fontSize: "45px"
                                                    }}
                                                ></i>

                                            </div>

                                            <div
                                                className="progress mt-3"
                                                style={{ height: "8px" }}
                                            >

                                                <div
                                                    className={`progress-bar bg-${card.color}`}
                                                    style={{
                                                        width:
                                                            totalSystemRecords === 0
                                                                ? "0%"
                                                                : `${(card.value / totalSystemRecords) * 100}%`
                                                    }}
                                                ></div>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                        <div className="card shadow mt-3">

                            <div className="card-body text-center">

                                <h4>

                                    Total System Records

                                </h4>

                                <h1 className="text-dark">

                                    {totalSystemRecords}

                                </h1>

                            </div>

                        </div>

                    </>

                )}

            </div>

        </DashboardLayout>

    );

}

export default AnalyticsDashboard;