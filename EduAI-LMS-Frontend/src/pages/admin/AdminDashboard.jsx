import { Link } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";

function AdminDashboard() {
    const { user } = useAuth();

    const adminModules = [
        {
            title: "User Management",
            description: "Manage users, roles, and account access.",
            icon: "👥",
            path: "/users",
        },
        {
            title: "Courses",
            description: "Create and manage courses across the LMS.",
            icon: "📚",
            path: "/courses",
        },
        {
            title: "Subjects",
            description: "Organize subjects for your learning system.",
            icon: "📖",
            path: "/subjects",
        },
        {
            title: "Topics",
            description: "Manage learning topics and course structure.",
            icon: "📑",
            path: "/topics",
        },
        {
            title: "Resources",
            description: "Manage study materials and resources.",
            icon: "📂",
            path: "/resources",
        },
        {
            title: "Enrollments",
            description: "Manage student course enrollments.",
            icon: "👨‍🎓",
            path: "/enrollments",
        },
        {
            title: "Assignments",
            description: "Create and manage student assignments.",
            icon: "📝",
            path: "/assignments",
        },
        {
            title: "Submissions",
            description: "Review and manage assignment submissions.",
            icon: "📤",
            path: "/submissions",
        },
        {
            title: "Quizzes",
            description: "Manage quizzes and assessment content.",
            icon: "🧠",
            path: "/quizzes",
        },
        {
            title: "Announcements",
            description: "Publish important LMS announcements.",
            icon: "📢",
            path: "/announcements",
        },
        {
            title: "Discussions",
            description: "Manage discussion forums and conversations.",
            icon: "💬",
            path: "/discussions",
        },
        {
            title: "Course Progress",
            description: "Track student learning progress.",
            icon: "📈",
            path: "/course-progress",
        },
        {
            title: "Certificates",
            description: "Generate and manage certificates.",
            icon: "🎓",
            path: "/certificates",
        },
        {
            title: "Reports & Analytics",
            description: "View performance, attendance, and completion reports.",
            icon: "📊",
            path: "/reports",
        },
        {
            title: "Notifications",
            description: "Send and manage system notifications.",
            icon: "🔔",
            path: "/notifications",
        },
    ];

    const adminName = user?.fullName || user?.name || "Administrator";

    return (
        <DashboardLayout>
            <style>{`
                .admin-dashboard {
                    min-height: calc(100vh - 30px);
                    padding: 8px 4px 40px;
                    background: #f6f8fc;
                }

                .admin-hero {
                    position: relative;
                    overflow: hidden;
                    border-radius: 22px;
                    padding: 30px;
                    color: white;
                    background: linear-gradient(135deg, #0d6efd 0%, #4f46e5 55%, #7c3aed 100%);
                    box-shadow: 0 14px 35px rgba(37, 99, 235, 0.18);
                }

                .admin-hero::after {
                    content: "";
                    position: absolute;
                    width: 220px;
                    height: 220px;
                    border-radius: 50%;
                    right: -65px;
                    top: -90px;
                    background: rgba(255,255,255,0.12);
                }

                .admin-hero-content {
                    position: relative;
                    z-index: 1;
                }

                .admin-eyebrow {
                    display: inline-flex;
                    align-items: center;
                    gap: 7px;
                    padding: 6px 11px;
                    margin-bottom: 12px;
                    border-radius: 999px;
                    background: rgba(255,255,255,0.15);
                    font-size: 0.82rem;
                    font-weight: 600;
                }

                .admin-hero h1 {
                    font-size: clamp(1.7rem, 3vw, 2.35rem);
                    font-weight: 750;
                    margin-bottom: 8px;
                }

                .admin-hero p {
                    max-width: 680px;
                    margin-bottom: 0;
                    color: rgba(255,255,255,0.86);
                }

                .admin-section-title {
                    font-weight: 750;
                    color: #172033;
                    margin: 30px 0 15px;
                }

                .admin-module {
                    height: 100%;
                    display: block;
                    padding: 0;
                    color: inherit;
                    text-decoration: none;
                    border-radius: 18px;
                    transition: transform .18s ease, box-shadow .18s ease;
                }

                .admin-module:hover {
                    color: inherit;
                    transform: translateY(-5px);
                }

                .admin-module-card {
                    height: 100%;
                    min-height: 190px;
                    padding: 22px;
                    border: 1px solid #e8ebf2;
                    border-radius: 18px;
                    background: #fff;
                    box-shadow: 0 5px 18px rgba(15, 23, 42, 0.055);
                    transition: box-shadow .18s ease, border-color .18s ease;
                }

                .admin-module:hover .admin-module-card {
                    border-color: #cbd9ff;
                    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.10);
                }

                .admin-icon {
                    width: 52px;
                    height: 52px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 15px;
                    background: #eef4ff;
                    font-size: 1.55rem;
                    margin-bottom: 18px;
                }

                .admin-module-card h5 {
                    color: #172033;
                    font-weight: 700;
                    margin-bottom: 7px;
                }

                .admin-module-card p {
                    color: #718096;
                    font-size: 0.91rem;
                    line-height: 1.55;
                    margin-bottom: 16px;
                }

                .admin-open {
                    color: #0d6efd;
                    font-size: 0.84rem;
                    font-weight: 700;
                }

                @media (max-width: 576px) {
                    .admin-hero {
                        padding: 24px 20px;
                        border-radius: 18px;
                    }

                    .admin-module-card {
                        min-height: 165px;
                    }
                }
            `}</style>

            <div className="container-fluid admin-dashboard">
                <div className="admin-hero">
                    <div className="admin-hero-content">
                        <div className="admin-eyebrow">
                            ⚙️ Administration
                        </div>

                        <h1>Welcome back, {adminName}</h1>

                        <p>
                            Manage your SUBMYS LMS from one central workspace.
                            Access users, courses, assessments, reports, and
                            system resources quickly.
                        </p>
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-end flex-wrap gap-2">
                    <div>
                        <h3 className="admin-section-title mb-1">
                            Administration Workspace
                        </h3>
                        <p className="text-muted mb-0">
                            Choose a section to manage your LMS.
                        </p>
                    </div>
                </div>

                <div className="row g-4 mt-1">
                    {adminModules.map((item) => (
                        <div className="col-12 col-sm-6 col-lg-4 col-xl-3" key={item.path}>
                            <Link to={item.path} className="admin-module">
                                <div className="admin-module-card">
                                    <div className="admin-icon">
                                        {item.icon}
                                    </div>

                                    <h5>{item.title}</h5>

                                    <p>{item.description}</p>

                                    <span className="admin-open">
                                        Open section →
                                    </span>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default AdminDashboard;