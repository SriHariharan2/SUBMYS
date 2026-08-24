import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import NotificationService from "../../services/NotificationService";

function NotificationList() {

    const { user } = useAuth();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const role = user?.role?.toUpperCase();

    // =========================================================
    // LOAD NOTIFICATIONS
    // =========================================================

    useEffect(() => {

        const loadNotifications = async () => {

            if (!user?.id) {
                setLoading(false);
                return;
            }

            try {

                setLoading(true);
                setError("");

                console.log("Logged-in user:", user);
                console.log("User ID:", user.id);
                console.log("User role:", role);

                let response;

                // =================================================
                // STUDENT
                // =================================================

                if (role === "STUDENT") {

                    response =
                        await NotificationService.getByUser(user.id);

                }

                // =================================================
                // ADMIN / TEACHER
                // =================================================

                else {

                    response =
                        await NotificationService.getAll();

                }

                console.log(
                    "Notifications response:",
                    response
                );

                let data = response?.data || [];

                if (!Array.isArray(data)) {
                    data = [];
                }

                // Newest first
                data.sort((a, b) => {

                    const dateA = a?.createdAt
                        ? new Date(a.createdAt).getTime()
                        : 0;

                    const dateB = b?.createdAt
                        ? new Date(b.createdAt).getTime()
                        : 0;

                    return dateB - dateA;

                });

                setNotifications(data);

            } catch (err) {

                console.error(
                    "Failed to load notifications:",
                    err
                );

                console.error(
                    "Backend response:",
                    err?.response?.data
                );

                setError(
                    err?.response?.data?.message ||
                    "Failed to load notifications."
                );

                setNotifications([]);

            } finally {

                setLoading(false);

            }

        };

        loadNotifications();

    }, [user?.id, role]);


    // =========================================================
    // MARK AS READ
    // =========================================================

    const handleMarkAsRead = async (id) => {

        try {

            await NotificationService.markAsRead(id);

            setNotifications((previous) =>
                previous.map((notification) =>
                    notification.id === id
                        ? {
                            ...notification,
                            read: true
                        }
                        : notification
                )
            );

        } catch (err) {

            console.error(
                "Failed to mark notification as read:",
                err
            );

        }

    };


    // =========================================================
    // DELETE
    // ADMIN ONLY
    // =========================================================

    const handleDelete = async (id) => {

        const confirmed = window.confirm(
            "Are you sure you want to delete this notification?"
        );

        if (!confirmed) {
            return;
        }

        try {

            await NotificationService.remove(id);

            setNotifications((previous) =>
                previous.filter(
                    (notification) =>
                        notification.id !== id
                )
            );

        } catch (err) {

            console.error(
                "Failed to delete notification:",
                err
            );

            alert("Failed to delete notification.");

        }

    };


    // =========================================================
    // FORMAT DATE
    // =========================================================

    const formatDate = (date) => {

        if (!date) {
            return "N/A";
        }

        try {

            return new Date(date).toLocaleString();

        } catch {

            return date;

        }

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <DashboardLayout>

            <div className="container-fluid">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="mb-1">
                            {role === "STUDENT"
                                ? "My Notifications"
                                : "Notifications"
                            }
                        </h2>

                        {role === "STUDENT" && (

                            <p className="text-muted mb-0">
                                Notifications for your account
                            </p>

                        )}

                    </div>


                    {/* =============================================
                        ADMIN ONLY
                    ============================================= */}

                    {role !== "STUDENT" && (

                        <button
                            className="btn btn-success"
                            onClick={() => {
                                // Keep your existing Add Notification
                                // navigation/modal logic here.
                                console.log(
                                    "Add Notification clicked"
                                );
                            }}
                        >
                            + Add Notification
                        </button>

                    )}

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="alert alert-danger">

                        {error}

                    </div>

                )}


                {/* =================================================
                    LOADING
                ================================================= */}

                {loading && (

                    <div className="text-center py-5">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <p className="mt-2 text-muted">
                            Loading notifications...
                        </p>

                    </div>

                )}


                {/* =================================================
                    NO NOTIFICATIONS
                ================================================= */}

                {!loading &&
                    !error &&
                    notifications.length === 0 && (

                        <div className="alert alert-info">

                            No notifications found.

                        </div>

                    )}


                {/* =================================================
                    STUDENT VIEW
                ================================================= */}

                {!loading &&
                    !error &&
                    role === "STUDENT" &&
                    notifications.length > 0 && (

                        <div className="row">

                            <div className="col-lg-10">

                                {notifications.map(
                                    (notification) => (

                                        <div
                                            key={notification.id}
                                            className={`card shadow-sm mb-3 ${
                                                notification.read
                                                    ? ""
                                                    : "border-primary"
                                            }`}
                                        >

                                            <div className="card-body">

                                                <div className="d-flex justify-content-between align-items-start">

                                                    <div>

                                                        <h5 className="card-title mb-2">

                                                            {notification.title ||
                                                                "Notification"}

                                                        </h5>

                                                        <p className="card-text mb-2">

                                                            {
                                                                notification.message
                                                            }

                                                        </p>

                                                        <small className="text-muted">

                                                            {formatDate(
                                                                notification.createdAt
                                                            )}

                                                        </small>

                                                    </div>


                                                    <div className="ms-3">

                                                        {notification.read ? (

                                                            <span className="badge bg-secondary">

                                                                Read

                                                            </span>

                                                        ) : (

                                                            <span className="badge bg-warning text-dark">

                                                                Unread

                                                            </span>

                                                        )}

                                                    </div>

                                                </div>


                                                {!notification.read && (

                                                    <button
                                                        className="btn btn-primary btn-sm mt-3"
                                                        onClick={() =>
                                                            handleMarkAsRead(
                                                                notification.id
                                                            )
                                                        }
                                                    >
                                                        Mark as Read
                                                    </button>

                                                )}

                                            </div>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                {/* =================================================
                    ADMIN / TEACHER VIEW
                ================================================= */}

                {!loading &&
                    !error &&
                    role !== "STUDENT" &&
                    notifications.length > 0 && (

                        <div className="card shadow">

                            <div className="card-body">

                                <div className="table-responsive">

                                    <table className="table table-bordered table-hover mb-0">

                                        <thead className="table-dark">

                                            <tr>

                                                <th>ID</th>

                                                <th>Title</th>

                                                <th>Message</th>

                                                <th>User</th>

                                                <th>Status</th>

                                                <th>Created</th>

                                                <th>Actions</th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {notifications.map(
                                                (notification) => (

                                                    <tr
                                                        key={
                                                            notification.id
                                                        }
                                                    >

                                                        <td>
                                                            {
                                                                notification.id
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                notification.title ||
                                                                "-"
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                notification.message
                                                            }
                                                        </td>

                                                        <td>
                                                            {
                                                                notification.user?.fullName ||
                                                                notification.user?.name ||
                                                                notification.user?.id ||
                                                                "-"
                                                            }
                                                        </td>

                                                        <td>

                                                            {notification.read ? (

                                                                <span className="badge bg-secondary">
                                                                    Read
                                                                </span>

                                                            ) : (

                                                                <span className="badge bg-warning text-dark">
                                                                    Unread
                                                                </span>

                                                            )}

                                                        </td>

                                                        <td>
                                                            {formatDate(
                                                                notification.createdAt
                                                            )}
                                                        </td>

                                                        <td>

                                                            {!notification.read && (

                                                                <button
                                                                    className="btn btn-warning btn-sm me-2"
                                                                    onClick={() =>
                                                                        handleMarkAsRead(
                                                                            notification.id
                                                                        )
                                                                    }
                                                                >
                                                                    Mark Read
                                                                </button>

                                                            )}

                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        notification.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>

                    )}

            </div>

        </DashboardLayout>

    );

}

export default NotificationList;