import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const getInitials = (name) => {
        if (!name) return "U";

        return name
            .split(" ")
            .map((word) => word.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    const NavItem = ({ to, icon, label, badge }) => {
        const active = isActive(to);

        return (
            <li className="nav-item mb-1">
                <Link
                    to={to}
                    className={`d-flex align-items-center text-decoration-none ${
                        active ? "sidebar-link active" : "sidebar-link"
                    }`}
                >
                    <span className="sidebar-icon">
                        {icon}
                    </span>

                    <span className="sidebar-label">
                        {label}
                    </span>

                    {badge && (
                        <span className="badge bg-primary ms-auto">
                            {badge}
                        </span>
                    )}
                </Link>
            </li>
        );
    };

    const SectionTitle = ({ children }) => (
        <div className="sidebar-section-title">
            {children}
        </div>
    );

    return (
        <>
            <style>
                {`
                    .eduai-sidebar {
                        width: 270px;
                        min-height: 100vh;
                        background: linear-gradient(
                            180deg,
                            #111827 0%,
                            #1f2937 100%
                        );
                        color: #ffffff;
                        display: flex;
                        flex-direction: column;
                        position: sticky;
                        top: 0;
                        box-shadow: 4px 0 18px rgba(0, 0, 0, 0.08);
                        z-index: 1000;
                    }

                    .sidebar-brand {
                        padding: 24px 20px 20px;
                        border-bottom: 1px solid rgba(255,255,255,0.08);
                    }

                    .sidebar-brand-wrapper {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }

                    .sidebar-brand-logo {
                        width: 42px;
                        height: 42px;
                        border-radius: 12px;
                        background: linear-gradient(
                            135deg,
                            #2563eb,
                            #7c3aed
                        );
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 21px;
                        box-shadow: 0 6px 15px rgba(37,99,235,0.3);
                    }

                    .sidebar-brand-title {
                        font-size: 20px;
                        font-weight: 700;
                        letter-spacing: -0.3px;
                        margin: 0;
                    }

                    .sidebar-brand-subtitle {
                        font-size: 11px;
                        color: #94a3b8;
                        margin-top: 2px;
                    }

                    .sidebar-user {
                        margin: 18px 14px;
                        padding: 14px;
                        border-radius: 14px;
                        background: rgba(255,255,255,0.05);
                        border: 1px solid rgba(255,255,255,0.07);
                    }

                    .sidebar-user-wrapper {
                        display: flex;
                        align-items: center;
                        gap: 12px;
                    }

                    .sidebar-avatar {
                        width: 42px;
                        height: 42px;
                        min-width: 42px;
                        border-radius: 50%;
                        background: linear-gradient(
                            135deg,
                            #3b82f6,
                            #8b5cf6
                        );
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 14px;
                        font-weight: 700;
                    }

                    .sidebar-user-name {
                        font-size: 14px;
                        font-weight: 600;
                        color: #f8fafc;
                        margin: 0;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .sidebar-user-role {
                        display: inline-block;
                        margin-top: 3px;
                        font-size: 10px;
                        font-weight: 700;
                        letter-spacing: 0.7px;
                        color: #93c5fd;
                        text-transform: uppercase;
                    }

                    .sidebar-navigation {
                        flex: 1;
                        overflow-y: auto;
                        padding: 0 12px 20px;
                    }

                    .sidebar-navigation::-webkit-scrollbar {
                        width: 5px;
                    }

                    .sidebar-navigation::-webkit-scrollbar-track {
                        background: transparent;
                    }

                    .sidebar-navigation::-webkit-scrollbar-thumb {
                        background: rgba(255,255,255,0.15);
                        border-radius: 10px;
                    }

                    .sidebar-section-title {
                        color: #64748b;
                        font-size: 10px;
                        font-weight: 700;
                        letter-spacing: 1.2px;
                        text-transform: uppercase;
                        padding: 12px 12px 7px;
                    }

                    .sidebar-link {
                        min-height: 43px;
                        padding: 10px 12px;
                        border-radius: 10px;
                        color: #cbd5e1 !important;
                        transition:
                            background-color 0.18s ease,
                            color 0.18s ease,
                            transform 0.18s ease;
                    }

                    .sidebar-link:hover {
                        color: #ffffff !important;
                        background: rgba(255,255,255,0.07);
                        transform: translateX(2px);
                    }

                    .sidebar-link.active {
                        color: #ffffff !important;
                        background: linear-gradient(
                            90deg,
                            rgba(37,99,235,0.95),
                            rgba(59,130,246,0.78)
                        );
                        box-shadow: 0 5px 14px rgba(37,99,235,0.22);
                    }

                    .sidebar-icon {
                        width: 28px;
                        min-width: 28px;
                        text-align: center;
                        font-size: 17px;
                        margin-right: 8px;
                    }

                    .sidebar-label {
                        font-size: 13.5px;
                        font-weight: 500;
                        line-height: 1.2;
                    }

                    .sidebar-ai {
                        margin-top: 6px;
                        border-radius: 12px;
                        background: linear-gradient(
                            135deg,
                            rgba(124,58,237,0.18),
                            rgba(37,99,235,0.14)
                        );
                        border: 1px solid rgba(129,140,248,0.18);
                    }

                    .sidebar-ai .sidebar-link {
                        color: #e0e7ff !important;
                    }

                    .sidebar-ai .sidebar-link:hover {
                        background: rgba(124,58,237,0.22);
                    }

                    .sidebar-footer {
                        padding: 14px;
                        border-top: 1px solid rgba(255,255,255,0.08);
                        background: rgba(0,0,0,0.08);
                    }

                    .sidebar-logout {
                        width: 100%;
                        border: 1px solid rgba(248,113,113,0.25);
                        background: rgba(220,38,38,0.08);
                        color: #fca5a5;
                        border-radius: 10px;
                        padding: 10px 12px;
                        font-size: 13px;
                        font-weight: 600;
                        transition: all 0.18s ease;
                    }

                    .sidebar-logout:hover {
                        background: rgba(220,38,38,0.18);
                        color: #fecaca;
                        border-color: rgba(248,113,113,0.4);
                    }

                    .sidebar-primary-action {
                        width: 100%;
                        border: none;
                        border-radius: 10px;
                        background: linear-gradient(
                            135deg,
                            #2563eb,
                            #4f46e5
                        );
                        color: white;
                        padding: 10px 12px;
                        font-size: 13px;
                        font-weight: 600;
                        margin-bottom: 8px;
                        box-shadow: 0 5px 12px rgba(37,99,235,0.22);
                    }

                    .sidebar-primary-action:hover {
                        background: linear-gradient(
                            135deg,
                            #1d4ed8,
                            #4338ca
                        );
                        color: white;
                    }

                    @media (max-width: 900px) {
                        .eduai-sidebar {
                            width: 230px;
                        }

                        .sidebar-label {
                            font-size: 12.5px;
                        }
                    }
                `}
            </style>

            <aside className="eduai-sidebar">

               

                {/* ==================================================
                    USER PROFILE
                ================================================== */}

                <div className="sidebar-user">

                    <div className="sidebar-user-wrapper">

                        <div className="sidebar-avatar">
                            {getInitials(user?.fullName)}
                        </div>

                        <div style={{ minWidth: 0 }}>

                            <p className="sidebar-user-name">
                                {user?.fullName || "User"}
                            </p>

                            <span className="sidebar-user-role">
                                {user?.role || "USER"}
                            </span>

                        </div>

                    </div>

                </div>

                {/* ==================================================
                    NAVIGATION
                ================================================== */}

                <div className="sidebar-navigation">

                    {/* ==================================================
                        ADMIN
                    ================================================== */}

                    {user?.role === "ADMIN" && (
                        <>
                            <SectionTitle>
                                Main
                            </SectionTitle>

                            <ul className="nav flex-column">

                                <NavItem
                                    to="/admin/dashboard"
                                    icon="🏠"
                                    label="Dashboard"
                                />

                                <NavItem
                                    to="/users"
                                    icon="👥"
                                    label="User Management"
                                />

                                <NavItem
                                    to="/courses"
                                    icon="📚"
                                    label="Courses"
                                />

                                <NavItem
                                    to="/subjects"
                                    icon="📖"
                                    label="Subjects"
                                />

                                <NavItem
                                    to="/topics"
                                    icon="📝"
                                    label="Topics"
                                />

                                <NavItem
                                    to="/resources"
                                    icon="📂"
                                    label="Learning Resources"
                                />

                            </ul>

                            <SectionTitle>
                                Academic
                            </SectionTitle>

                            <ul className="nav flex-column">

                                <NavItem
                                    to="/enrollments"
                                    icon="🎓"
                                    label="Enrollments"
                                />

                                <li className="nav-item mb-1">
                                    <Link
                                        to="/questions/add"
                                        className="btn sidebar-primary-action"
                                    >
                                        ➕ Add Question
                                    </Link>
                                </li>

                                <NavItem
                                    to="/assignments"
                                    icon="📝"
                                    label="Assignments"
                                />

                                <NavItem
                                    to="/submissions"
                                    icon="📤"
                                    label="Assignment Submissions"
                                />

                                <NavItem
                                    to="/quizzes"
                                    icon="❓"
                                    label="Quizzes"
                                />

                                <NavItem
                                    to="/grades"
                                    icon="📊"
                                    label="Grade Management"
                                />

                                <NavItem
                                    to="/attendance"
                                    icon="📅"
                                    label="Attendance"
                                />

                            </ul>

                            <SectionTitle>
                                Communication
                            </SectionTitle>

                            <ul className="nav flex-column">

                                <NavItem
                                    to="/announcements"
                                    icon="📢"
                                    label="Announcements"
                                />

                                <NavItem
                                    to="/discussions"
                                    icon="💬"
                                    label="Discussions"
                                />

                                <NavItem
                                    to="/events"
                                    icon="🗓️"
                                    label="Calendar & Events"
                                />

                                <NavItem
                                    to="/reports"
                                    icon="📈"
                                    label="Reports & Analytics"
                                />

                            </ul>

                            <SectionTitle>
                                AI Tools
                            </SectionTitle>

                            <ul className="nav flex-column sidebar-ai">

                                <NavItem
                                    to="/ai-chat"
                                    icon="🤖"
                                    label="Assistant"
                                />

                                <NavItem
                                    to="/ai-quiz-generator"
                                    icon="🧠"
                                    label="Practice Quiz "
                                />

                                <NavItem
                                    to="/ai-assignment-reviewer"
                                    icon="📄"
                                    label="AI Assignment Reviewer"
                                />

                            </ul>

                            <SectionTitle>
                                Account
                            </SectionTitle>

                            <ul className="nav flex-column">

                                <NavItem
                                    to="/notifications"
                                    icon="🔔"
                                    label="Notifications"
                                />

                                <NavItem
                                    to="/profile"
                                    icon="👤"
                                    label="My Profile"
                                />

                            </ul>
                        </>
                    )}

                    {/* ==================================================
                        TEACHER
                    ================================================== */}

                    {user?.role === "TEACHER" && (
                        <>
                            <SectionTitle>
                                Main
                            </SectionTitle>

                            <ul className="nav flex-column">

                                <NavItem
                                    to="/teacher/dashboard"
                                    icon="🏠"
                                    label="Dashboard"
                                />

                                <NavItem
                                    to="/courses"
                                    icon="📚"
                                    label="My Courses"
                                />

                                <NavItem
                                    to="/subjects"
                                    icon="📖"
                                    label="Subjects"
                                />

                                <NavItem
                                    to="/topics"
                                    icon="📝"
                                    label="Topics"
                                />

                                <NavItem
                                    to="/resources"
                                    icon="📂"
                                    label="Learning Resources"
                                />

                            </ul>

                            <SectionTitle>
                                Teaching
                            </SectionTitle>

                            <ul className="nav flex-column">

                                <NavItem
                                    to="/assignments"
                                    icon="📝"
                                    label="Assignments"
                                />

                                <NavItem
                                    to="/submissions"
                                    icon="📤"
                                    label="Assignment Submissions"
                                />

                                <NavItem
                                    to="/quizzes"
                                    icon="❓"
                                    label="Quizzes"
                                />

                                <NavItem
                                    to="/grades"
                                    icon="📊"
                                    label="Grade Management"
                                />

                                <NavItem
                                    to="/attendance"
                                    icon="📅"
                                    label="Attendance"
                                />

                            </ul>

                            <SectionTitle>
                                Communication
                            </SectionTitle>

                            <ul className="nav flex-column">

                                <NavItem
                                    to="/announcements"
                                    icon="📢"
                                    label="Announcements"
                                />

                                <NavItem
                                    to="/discussions"
                                    icon="💬"
                                    label="Discussions"
                                />

                                <NavItem
                                    to="/events"
                                    icon="🗓️"
                                    label="Calendar & Events"
                                />

                                <NavItem
                                    to="/teacher-report"
                                    icon="📈"
                                    label="Teacher Analytics"
                                />

                            </ul>

                            <SectionTitle>
                                AI Tools
                            </SectionTitle>

                            <ul className="nav flex-column sidebar-ai">

                                <NavItem
                                    to="/ai-chat"
                                    icon="🤖"
                                    label="EduAI Assistant"
                                />

                                <NavItem
                                    to="/ai-quiz-generator"
                                    icon="🧠"
                                    label="AI Quiz Generator"
                                />

                                <NavItem
                                    to="/ai-assignment-reviewer"
                                    icon="📄"
                                    label="AI Assignment Reviewer"
                                />

                            </ul>

                            <SectionTitle>
                                Account
                            </SectionTitle>

                            <ul className="nav flex-column">

                                <NavItem
                                    to="/notifications"
                                    icon="🔔"
                                    label="Notifications"
                                />

                                <NavItem
                                    to="/profile"
                                    icon="👤"
                                    label="My Profile"
                                />

                            </ul>
                        </>
                    )}

                    {/* ==================================================
                        STUDENT
                    ================================================== */}

                    {user?.role === "STUDENT" && (
                        <>
                            <SectionTitle>
                                Learning
                            </SectionTitle>

                            <ul className="nav flex-column">

                                <NavItem
                                    to="/student/dashboard"
                                    icon="🏠"
                                    label="Dashboard"
                                />

                                <NavItem
                                    to="/my-courses"
                                    icon="📚"
                                    label="My Courses"
                                />

                                <NavItem
                                    to="/resources"
                                    icon="📂"
                                    label="Learning Resources"
                                />

                                <NavItem
                                    to="/assignments"
                                    icon="📝"
                                    label="Assignments"
                                />

                                <NavItem
                                    to="/my-submissions"
                                    icon="📤"
                                    label="My Submissions"
                                />

                                <NavItem
                                    to="/quizzes"
                                    icon="❓"
                                    label="Quizzes"
                                />

                            </ul>

                            <SectionTitle>
                                Progress
                            </SectionTitle>

                            <ul className="nav flex-column">

                                <NavItem
                                    to="/my-grades"
                                    icon="📊"
                                    label="My Grades"
                                />

                                <NavItem
                                    to="/my-attendance"
                                    icon="📅"
                                    label="My Attendance"
                                />

                                <NavItem
                                    to="/calendar"
                                    icon="🗓️"
                                    label="My Calendar"
                                />

                                <NavItem
                                    to="/student-report"
                                    icon="📈"
                                    label="My Performance"
                                />

                                <NavItem
                                    to="/certificates"
                                    icon="🏆"
                                    label="Certificates"
                                />

                            </ul>

                            <SectionTitle>
                                AI Learning
                            </SectionTitle>

                            <ul className="nav flex-column sidebar-ai">

                                <NavItem
                                    to="/ai-chat"
                                    icon="🤖"
                                    label="Assistant"
                                />

                                <NavItem
                                    to="/ai-quiz-generator"
                                    icon="🧠"
                                    label="Practice Quiz "
                                />

                            </ul>

                            <SectionTitle>
                                Account
                            </SectionTitle>

                            <ul className="nav flex-column">

                                <NavItem
                                    to="/notifications"
                                    icon="🔔"
                                    label="Notifications"
                                />

                                <NavItem
                                    to="/profile"
                                    icon="👤"
                                    label="My Profile"
                                />

                            </ul>
                        </>
                    )}

                </div>

                {/* ==================================================
                    FOOTER
                ================================================== */}

                <div className="sidebar-footer">

                    <button
                        type="button"
                        className="sidebar-logout"
                        onClick={logout}
                    >
                        🚪 &nbsp; Sign Out
                    </button>

                </div>

            </aside>
        </>
    );
}

export default Sidebar;