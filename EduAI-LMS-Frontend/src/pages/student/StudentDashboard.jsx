import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import NotificationService from "../../services/NotificationService";

function StudentDashboard() {

    const { user } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(true);
    const [notificationError, setNotificationError] = useState("");

    // ============================================================
    // GET LOGGED-IN STUDENT ID
    // ============================================================

    const studentId =
        user?.id ||
        user?.userId ||
        user?.studentId;

    // ============================================================
    // LOAD LATEST NOTIFICATIONS
    // ============================================================

    useEffect(() => {

        const loadNotifications = async () => {

            if (!studentId) {
                setLoadingNotifications(false);
                return;
            }

            try {

                setLoadingNotifications(true);
                setNotificationError("");

                const response =
                    await NotificationService.getByUser(studentId);

                const notificationList =
                    Array.isArray(response.data)
                        ? response.data
                        : [];

                const sortedNotifications =
                    [...notificationList].sort((a, b) => {

                        const dateA =
                            new Date(a.createdAt || 0);

                        const dateB =
                            new Date(b.createdAt || 0);

                        return dateB - dateA;
                    });

                setNotifications(
                    sortedNotifications.slice(0, 3)
                );

            } catch (error) {

                console.error(
                    "Failed to load student notifications:",
                    error
                );

                setNotificationError(
                    "Unable to load notifications."
                );

                setNotifications([]);

            } finally {

                setLoadingNotifications(false);

            }
        };

        loadNotifications();

    }, [studentId]);

    // ============================================================
    // FORMAT DATE
    // ============================================================

    const formatDate = (date) => {

        if (!date) {
            return "";
        }

        const parsedDate =
            new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleString();
    };

    // ============================================================
    // MARK NOTIFICATION AS READ
    // ============================================================

    const handleMarkAsRead = async (notificationId) => {

        try {

            await NotificationService.markAsRead(
                notificationId
            );

            setNotifications(
                previousNotifications =>
                    previousNotifications.map(
                        notification =>
                            notification.id === notificationId
                                ? {
                                      ...notification,
                                      read: true,
                                      isRead: true
                                  }
                                : notification
                    )
            );

        } catch (error) {

            console.error(
                "Failed to mark notification as read:",
                error
            );

        }
    };

    // ============================================================
    // USER NAME
    // ============================================================

    const studentName =
        user?.fullName ||
        user?.name ||
        user?.username ||
        "Student";

    // ============================================================
    // QUICK LINK DATA
    // ============================================================

    const quickLinks = [

        {
            title: "My Courses",
            subtitle: "Continue learning",
            icon: "📚",
            path: "/my-courses"
        },

        {
            title: "Assignments",
            subtitle: "Complete your work",
            icon: "📝",
            path: "/assignments"
        },

        {
            title: "Quizzes",
            subtitle: "Test your knowledge",
            icon: "🧠",
            path: "/quizzes"
        },

        {
            title: "My Grades",
            subtitle: "View your results",
            icon: "📊",
            path: "/student-grades"
        },

        {
            title: "My Submissions",
            subtitle: "Track your submissions",
            icon: "📤",
            path: "/my-submissions"
        },

        {
            title: "Resources",
            subtitle: "Study materials",
            icon: "📂",
            path: "/resources"
        },

        {
            title: "Attendance",
            subtitle: "Check attendance",
            icon: "📅",
            path: "/student-attendance"
        },

        {
            title: "Calendar",
            subtitle: "Upcoming events",
            icon: "🗓️",
            path: "/calendar"
        },

        {
            title: "Performance",
            subtitle: "Academic progress",
            icon: "📈",
            path: "/student-report"
        },

        {
            title: "Certificates",
            subtitle: "Your achievements",
            icon: "🏆",
            path: "/certificates"
        },

        {
            title: "Notifications",
            subtitle: "Latest updates",
            icon: "🔔",
            path: "/notifications"
        },

        {
            title: "My Profile",
            subtitle: "Manage your account",
            icon: "👤",
            path: "/profile"
        }

    ];

    // ============================================================
    // UI
    // ============================================================

    return (

        <DashboardLayout>

            <div
                className="container-fluid px-3 px-md-4"
                style={{
                    background: "#f5f7fb",
                    minHeight: "100vh",
                    paddingTop: "24px",
                    paddingBottom: "40px"
                }}
            >

                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                    className="mb-4"
                    style={{
                        background:
                            "linear-gradient(135deg, #1769ff, #12b8d8)",
                        borderRadius: "18px",
                        padding: "28px 30px",
                        color: "white",
                        boxShadow:
                            "0 8px 24px rgba(23,105,255,0.18)"
                    }}
                >

                    <div className="d-flex align-items-center gap-3">

                        <div
                            style={{
                                width: "54px",
                                height: "54px",
                                borderRadius: "14px",
                                background:
                                    "rgba(255,255,255,0.18)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "28px"
                            }}
                        >
                            👋
                        </div>

                        <div>

                            <h2
                                className="fw-bold mb-1"
                                style={{
                                    fontSize: "28px"
                                }}
                            >
                                Welcome back, {studentName}
                            </h2>

                            <p
                                className="mb-0"
                                style={{
                                    opacity: 0.9,
                                    fontSize: "15px"
                                }}
                            >
                                Continue your learning journey,
                                track your progress, and stay on top
                                of your studies.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ==================================================
                    LATEST NOTIFICATIONS
                ================================================== */}

                <div
                    className="card border-0"
                    style={{
                        borderRadius: "16px",
                        overflow: "hidden",
                        boxShadow:
                            "0 5px 18px rgba(15,23,42,0.08)"
                    }}
                >

                    {/* Notification Header */}

                    <div
                        className="d-flex justify-content-between align-items-center"
                        style={{
                            padding: "18px 22px",
                            borderBottom:
                                "1px solid #edf0f5"
                        }}
                    >

                        <div>

                            <h5
                                className="fw-bold mb-1"
                                style={{
                                    color: "#0f172a"
                                }}
                            >
                                🔔 Latest Notifications
                            </h5>

                            <small
                                className="text-muted"
                            >
                                Your most recent LMS updates
                            </small>

                        </div>

                        <Link
                            to="/notifications"
                            className="btn btn-primary btn-sm"
                            style={{
                                borderRadius: "8px",
                                padding:
                                    "7px 14px"
                            }}
                        >
                            View All
                        </Link>

                    </div>


                    {/* Notification Body */}

                    <div
                        style={{
                            background: "#ffffff"
                        }}
                    >

                        {loadingNotifications && (

                            <div
                                className="p-4 text-muted"
                            >
                                Loading notifications...
                            </div>

                        )}


                        {!loadingNotifications &&
                            notificationError && (

                                <div className="p-3">

                                    <div
                                        className="alert alert-danger mb-0"
                                    >
                                        {notificationError}
                                    </div>

                                </div>

                            )}


                        {!loadingNotifications &&
                            !notificationError &&
                            notifications.length === 0 && (

                                <div
                                    className="p-4 text-muted"
                                >
                                    No notifications found.
                                </div>

                            )}


                        {!loadingNotifications &&
                            !notificationError &&
                            notifications.length > 0 && (

                                <div>

                                    {notifications.map(
                                        (notification, index) => {

                                            const isRead =
                                                notification.isRead ??
                                                notification.read ??
                                                false;

                                            return (

                                                <div
                                                    key={
                                                        notification.id
                                                    }
                                                    style={{
                                                        padding:
                                                            "18px 22px",
                                                        borderBottom:
                                                            index !==
                                                            notifications.length -
                                                                1
                                                                ? "1px solid #edf0f5"
                                                                : "none",
                                                        background:
                                                            !isRead
                                                                ? "#fbfcff"
                                                                : "#ffffff"
                                                    }}
                                                >

                                                    <div
                                                        className="d-flex justify-content-between align-items-start"
                                                    >

                                                        <div
                                                            className="d-flex gap-3"
                                                        >

                                                            {/* Notification Dot */}

                                                            <div
                                                                style={{
                                                                    width:
                                                                        "10px",
                                                                    height:
                                                                        "10px",
                                                                    minWidth:
                                                                        "10px",
                                                                    marginTop:
                                                                        "7px",
                                                                    borderRadius:
                                                                        "50%",
                                                                    background:
                                                                        !isRead
                                                                            ? "#2563eb"
                                                                            : "#cbd5e1"
                                                                }}
                                                            />

                                                            <div>

                                                                <h6
                                                                    className="fw-bold mb-1"
                                                                >
                                                                    {notification.title ||
                                                                        "Notification"}
                                                                </h6>

                                                                <p
                                                                    className="mb-1 text-muted"
                                                                    style={{
                                                                        fontSize:
                                                                            "14px"
                                                                    }}
                                                                >
                                                                    {
                                                                        notification.message
                                                                    }
                                                                </p>

                                                                {notification.createdAt && (

                                                                    <small
                                                                        className="text-muted"
                                                                    >
                                                                        {formatDate(
                                                                            notification.createdAt
                                                                        )}
                                                                    </small>

                                                                )}

                                                            </div>

                                                        </div>


                                                        {/* Notification Actions */}

                                                        <div
                                                            className="text-end ms-3"
                                                        >

                                                            {!isRead && (

                                                                <>

                                                                    <span
                                                                        className="badge"
                                                                        style={{
                                                                            background:
                                                                                "#fff3cd",
                                                                            color:
                                                                                "#856404",
                                                                            borderRadius:
                                                                                "6px",
                                                                            marginBottom:
                                                                                "7px"
                                                                        }}
                                                                    >
                                                                        Unread
                                                                    </span>

                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-sm btn-outline-primary d-block"
                                                                        style={{
                                                                            borderRadius:
                                                                                "7px"
                                                                        }}
                                                                        onClick={() =>
                                                                            handleMarkAsRead(
                                                                                notification.id
                                                                            )
                                                                        }
                                                                    >
                                                                        Mark Read
                                                                    </button>

                                                                </>

                                                            )}

                                                        </div>

                                                    </div>

                                                </div>

                                            );

                                        }
                                    )}

                                </div>

                            )}

                    </div>

                </div>


                {/* ==================================================
                    GAP BETWEEN NOTIFICATIONS AND QUICK LINKS
                ================================================== */}

                <div
                    style={{
                        height: "34px"
                    }}
                />


                {/* ==================================================
                    QUICK LINKS HEADER
                ================================================== */}

                <div className="mb-3">

                    <h4
                        className="fw-bold mb-1"
                        style={{
                            color: "#0f172a"
                        }}
                    >
                        Your Learning Hub
                    </h4>

                    <p
                        className="text-muted mb-0"
                        style={{
                            fontSize: "14px"
                        }}
                    >
                        Everything you need for your studies
                        in one place.
                    </p>

                </div>


                {/* ==================================================
                    SMALL QUICK LINK CARDS
                ================================================== */}

                <div className="row g-3">

                    {quickLinks.map((item) => (

                        <div
                            key={item.title}
                            className="col-6 col-md-4 col-lg-3"
                        >

                            <Link
                                to={item.path}
                                className="text-decoration-none"
                            >

                                <div
                                    className="card h-100 border-0"
                                    style={{
                                        borderRadius: "14px",
                                        padding: "0",
                                        minHeight: "145px",
                                        background: "#ffffff",
                                        boxShadow:
                                            "0 4px 14px rgba(15,23,42,0.07)",
                                        transition:
                                            "all 0.2s ease"
                                    }}
                                    onMouseEnter={(e) => {

                                        e.currentTarget.style.transform =
                                            "translateY(-3px)";

                                        e.currentTarget.style.boxShadow =
                                            "0 8px 22px rgba(15,23,42,0.12)";

                                    }}
                                    onMouseLeave={(e) => {

                                        e.currentTarget.style.transform =
                                            "translateY(0)";

                                        e.currentTarget.style.boxShadow =
                                            "0 4px 14px rgba(15,23,42,0.07)";

                                    }}
                                >

                                    <div
                                        className="card-body"
                                        style={{
                                            padding: "18px"
                                        }}
                                    >

                                        {/* Icon */}

                                        <div
                                            style={{
                                                width: "42px",
                                                height: "42px",
                                                borderRadius: "12px",
                                                background:
                                                    "#eef4ff",
                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                fontSize: "21px",
                                                marginBottom:
                                                    "13px"
                                            }}
                                        >
                                            {item.icon}
                                        </div>


                                        {/* Title */}

                                        <h6
                                            className="fw-bold mb-1"
                                            style={{
                                                color: "#0f172a",
                                                fontSize: "16px"
                                            }}
                                        >
                                            {item.title}
                                        </h6>


                                        {/* Subtitle */}

                                        <p
                                            className="mb-0 text-muted"
                                            style={{
                                                fontSize: "12px",
                                                lineHeight: "1.4"
                                            }}
                                        >
                                            {item.subtitle}
                                        </p>

                                    </div>

                                </div>

                            </Link>

                        </div>

                    ))}

                </div>

            </div>

        </DashboardLayout>

    );
}

export default StudentDashboard;