import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

function TeacherDashboard() {

    const { user } = useAuth();

    return (

        <DashboardLayout>

            <div className="container-fluid">

                <div className="mb-4">

                    <h2 className="fw-bold">
                        Teacher Dashboard
                    </h2>

                    <p className="text-muted">
                        Welcome, <strong>{user?.fullName || user?.name}</strong>
                    </p>

                </div>

                <div className="row g-4">

                    {/* My Courses */}
                    <div className="col-md-3">
                        <Link to="/courses" className="text-decoration-none">
                            <div className="card shadow h-100">
                                <div className="card-body text-center">
                                    <h1>📚</h1>
                                    <h5>My Courses</h5>
                                    <p className="text-muted">
                                        Manage your courses.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Assignments */}
                    <div className="col-md-3">
                        <Link to="/assignments" className="text-decoration-none">
                            <div className="card shadow h-100">
                                <div className="card-body text-center">
                                    <h1>📝</h1>
                                    <h5>Assignments</h5>
                                    <p className="text-muted">
                                        Create and manage assignments.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Assignment Submissions */}
                    <div className="col-md-3">
                        <Link to="/submissions" className="text-decoration-none">
                            <div className="card shadow h-100">
                                <div className="card-body text-center">
                                    <h1>📤</h1>
                                    <h5>Submissions</h5>
                                    <p className="text-muted">
                                        Review assignment submissions.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Quizzes */}
                    <div className="col-md-3">
                        <Link to="/quizzes" className="text-decoration-none">
                            <div className="card shadow h-100">
                                <div className="card-body text-center">
                                    <h1>🧠</h1>
                                    <h5>Quizzes</h5>
                                    <p className="text-muted">
                                        Manage quizzes.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Announcements */}
                    <div className="col-md-3">
                        <Link to="/announcements" className="text-decoration-none">
                            <div className="card shadow h-100">
                                <div className="card-body text-center">
                                    <h1>📢</h1>
                                    <h5>Announcements</h5>
                                    <p className="text-muted">
                                        Post course announcements.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Discussions */}
                    <div className="col-md-3">
                        <Link to="/discussions" className="text-decoration-none">
                            <div className="card shadow h-100">
                                <div className="card-body text-center">
                                    <h1>💬</h1>
                                    <h5>Discussions</h5>
                                    <p className="text-muted">
                                        Participate in discussions.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Grade Management */}
                    <div className="col-md-3">
                        <Link to="/grades" className="text-decoration-none">
                            <div className="card shadow h-100">
                                <div className="card-body text-center">
                                    <h1>📊</h1>
                                    <h5>Grade Management</h5>
                                    <p className="text-muted">
                                        Grade student work.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Attendance */}
                    <div className="col-md-3">
                        <Link to="/attendance" className="text-decoration-none">
                            <div className="card shadow h-100">
                                <div className="card-body text-center">
                                    <h1>📅</h1>
                                    <h5>Attendance</h5>
                                    <p className="text-muted">
                                        Mark and manage attendance.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Calendar & Events */}
                    <div className="col-md-3">
                        <Link to="/events" className="text-decoration-none">
                            <div className="card shadow h-100">
                                <div className="card-body text-center">
                                    <h1>🗓️</h1>
                                    <h5>Calendar & Events</h5>
                                    <p className="text-muted">
                                        Schedule classes and events.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Teacher Analytics */}
                    <div className="col-md-3">
                        <Link to="/teacher-report" className="text-decoration-none">
                            <div className="card shadow h-100">
                                <div className="card-body text-center">
                                    <h1>📈</h1>
                                    <h5>Teacher Analytics</h5>
                                    <p className="text-muted">
                                        View teaching analytics.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Notifications */}
                    <div className="col-md-3">
                        <Link to="/notifications" className="text-decoration-none">
                            <div className="card shadow h-100">
                                <div className="card-body text-center">
                                    <h1>🔔</h1>
                                    <h5>Notifications</h5>
                                    <p className="text-muted">
                                        View notifications.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* My Profile */}
                    <div className="col-md-3">
                        <Link to="/profile" className="text-decoration-none">
                            <div className="card shadow h-100">
                                <div className="card-body text-center">
                                    <h1>👤</h1>
                                    <h5>My Profile</h5>
                                    <p className="text-muted">
                                        View and edit your profile.
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default TeacherDashboard;