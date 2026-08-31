import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import AnnouncementService from "../../services/AnnouncementService";

function AnnouncementList() {
    const navigate = useNavigate();

    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [courseFilter, setCourseFilter] = useState("");
    const [messageFilter, setMessageFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");

    // =====================================================
    // LOAD ANNOUNCEMENTS
    // =====================================================

    useEffect(() => {
        loadAnnouncements();
    }, []);

    const loadAnnouncements = async () => {
        try {
            setLoading(true);

            const response = await AnnouncementService.getAll();

            console.log("Announcements API response:", response.data);

            setAnnouncements(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            console.error(
                "Unable to load announcements:",
                error
            );

            alert("Unable to load announcements.");
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const deleteAnnouncement = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this announcement?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await AnnouncementService.delete(id);

            alert("Announcement deleted successfully.");

            loadAnnouncements();
        } catch (error) {
            console.error(
                "Unable to delete announcement:",
                error
            );

            alert("Unable to delete announcement.");
        }
    };

    // =====================================================
    // EDIT
    // =====================================================

    const editAnnouncement = (id) => {
        navigate(`/announcements/edit/${id}`);
    };

    // =====================================================
    // ADD
    // =====================================================

    const addAnnouncement = () => {
        navigate("/announcements/add");
    };

    // =====================================================
    // GET UNIQUE COURSES
    // =====================================================

    const courses = useMemo(() => {
        const courseNames = announcements
            .map((announcement) => announcement.courseTitle)
            .filter(
                (courseTitle) =>
                    courseTitle &&
                    courseTitle !== "No Course"
            );

        return [...new Set(courseNames)].sort();
    }, [announcements]);

    // =====================================================
    // FILTER + SORT
    // =====================================================

    const filteredAnnouncements = useMemo(() => {
        let result = [...announcements];

        // Search
        if (search.trim() !== "") {
            const searchText = search
                .toLowerCase()
                .trim();

            result = result.filter((announcement) => {
                const title =
                    announcement.title?.toLowerCase() || "";

                const message =
                    announcement.message?.toLowerCase() || "";

                const course =
                    announcement.courseTitle?.toLowerCase() || "";

                return (
                    title.includes(searchText) ||
                    message.includes(searchText) ||
                    course.includes(searchText)
                );
            });
        }

        // Course filter
        if (courseFilter !== "") {
            result = result.filter(
                (announcement) =>
                    announcement.courseTitle === courseFilter
            );
        }

        // Message filter
        if (messageFilter === "with") {
            result = result.filter(
                (announcement) =>
                    announcement.message &&
                    announcement.message.trim() !== ""
            );
        }

        if (messageFilter === "without") {
            result = result.filter(
                (announcement) =>
                    !announcement.message ||
                    announcement.message.trim() === ""
            );
        }

        // Title sorting
        result.sort((a, b) => {
            const titleA =
                (a.title || "").toLowerCase();

            const titleB =
                (b.title || "").toLowerCase();

            if (sortOrder === "asc") {
                return titleA.localeCompare(titleB);
            }

            return titleB.localeCompare(titleA);
        });

        return result;
    }, [
        announcements,
        search,
        courseFilter,
        messageFilter,
        sortOrder,
    ]);

    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {
        setSearch("");
        setCourseFilter("");
        setMessageFilter("");
        setSortOrder("asc");
    };

    // =====================================================
    // DATE FORMAT
    // =====================================================

    const formatDate = (dateValue) => {
        if (!dateValue) {
            return "-";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return dateValue;
        }

        return date.toLocaleString();
    };

    // =====================================================
    // SIDEBAR NAVIGATION
    // =====================================================

    const goTo = (path) => {
        navigate(path);
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f5f5f5",
            }}
        >
            {/* =================================================
                TOP HEADER
            ================================================= */}

            <header
                style={{
                    height: "56px",
                    backgroundColor: "#1267e8",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0 12px",
                    boxSizing: "border-box",
                }}
            >
                <div
                    style={{
                        fontSize: "21px",
                        fontWeight: "400",
                    }}
                >
                    SUBMYS-LMS
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "18px",
                    }}
                >
                    <span
                        style={{
                            fontSize: "16px",
                        }}
                    >
                        Welcome,
                    </span>

                    <button
                        onClick={() => {
                            localStorage.clear();
                            navigate("/login");
                        }}
                        style={{
                            border: "none",
                            backgroundColor: "#fff",
                            color: "#111",
                            padding: "10px 16px",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* =================================================
                MAIN LAYOUT
            ================================================= */}

            <div
                style={{
                    display: "flex",
                    minHeight: "calc(100vh - 56px)",
                }}
            >
                {/* =================================================
                    SIDEBAR
                ================================================= */}

                <aside
                    style={{
                        width: "260px",
                        minWidth: "260px",
                        backgroundColor: "#202428",
                        color: "white",
                        paddingBottom: "30px",
                        boxSizing: "border-box",
                    }}
                >
                    {/* Logo */}

                    <div
                        style={{
                            textAlign: "center",
                            padding: "20px 10px 24px",
                            fontSize: "28px",
                            lineHeight: "1.15",
                        }}
                    >
                        SUBMYS LMS
                    </div>

                    {/* Admin Information */}

                    <div
                        style={{
                            padding: "0 16px 20px",
                        }}
                    >
                        <div
                            style={{
                                fontSize: "20px",
                                marginBottom: "10px",
                            }}
                        >
                            Admin Head
                        </div>

                        <div
                            style={{
                                fontSize: "14px",
                            }}
                        >
                            ADMIN
                        </div>
                    </div>

                    {/* Sidebar Menu */}

                    <nav>
                        {/* Dashboard */}

                        <button
                            onClick={() =>
                                goTo("/admin/dashboard")
                            }
                            style={menuButtonStyle}
                        >
                            🏠
                            <span>Dashboard</span>
                        </button>

                        {/* User Management */}

                        <button
                            onClick={() =>
                                goTo("/users")
                            }
                            style={menuButtonStyle}
                        >
                            👥
                            <span>User Management</span>
                        </button>

                        {/* Courses */}

                        <button
                            onClick={() =>
                                goTo("/courses")
                            }
                            style={menuButtonStyle}
                        >
                            📚
                            <span>Courses</span>
                        </button>

                        {/* Subjects */}

                        <button
                            onClick={() =>
                                goTo("/subjects")
                            }
                            style={menuButtonStyle}
                        >
                            📖
                            <span>Subjects</span>
                        </button>

                        {/* Topics */}

                        <button
                            onClick={() =>
                                goTo("/topics")
                            }
                            style={menuButtonStyle}
                        >
                            📄
                            <span>Topics</span>
                        </button>

                        {/* Learning Resources */}

                        <button
                            onClick={() =>
                                goTo("/resources")
                            }
                            style={menuButtonStyle}
                        >
                            📁
                            <span>Learning Resources</span>
                        </button>

                        {/* Enrollments */}

                        <button
                            onClick={() =>
                                goTo("/enrollments")
                            }
                            style={menuButtonStyle}
                        >
                            🎓
                            <span>Enrollments</span>
                        </button>

                        {/* Assignments */}

                        <button
                            onClick={() =>
                                goTo("/assignments")
                            }
                            style={menuButtonStyle}
                        >
                            📝
                            <span>Assignments</span>
                        </button>

                        {/* Assignment Submissions */}

                        <button
                            onClick={() =>
                                goTo("/submissions")
                            }
                            style={menuButtonStyle}
                        >
                            📤
                            <span>
                                Assignment Submissions
                            </span>
                        </button>

                        {/* Quizzes */}

                        <button
                            onClick={() =>
                                goTo("/quizzes")
                            }
                            style={menuButtonStyle}
                        >
                            ❓
                            <span>Quizzes</span>
                        </button>

                        {/* Announcements */}

                        <button
                            onClick={() =>
                                goTo("/announcements")
                            }
                            style={{
                                ...menuButtonStyle,
                                backgroundColor: "#198754",
                                borderRadius: "6px",
                            }}
                        >
                            📢
                            <span>Announcements</span>
                        </button>

                        {/* Notifications */}

                        <button
                            onClick={() =>
                                goTo("/notifications")
                            }
                            style={menuButtonStyle}
                        >
                            🔔
                            <span>Notifications</span>
                        </button>

                        {/* Discussions */}

                        <button
                            onClick={() =>
                                goTo("/discussions")
                            }
                            style={menuButtonStyle}
                        >
                            💬
                            <span>Discussions</span>
                        </button>

                        {/* Course Progress */}

                        <button
                            onClick={() =>
                                goTo("/progress")
                            }
                            style={menuButtonStyle}
                        >
                            📊
                            <span>Course Progress</span>
                        </button>

                        {/* Certificates */}

                        <button
                            onClick={() =>
                                goTo("/certificates")
                            }
                            style={menuButtonStyle}
                        >
                            🏆
                            <span>Certificates</span>
                        </button>

                        {/* Grades */}

                        <button
                            onClick={() =>
                                goTo("/grades")
                            }
                            style={menuButtonStyle}
                        >
                            📈
                            <span>Grades</span>
                        </button>

                        {/* Attendance */}

                        <button
                            onClick={() =>
                                goTo("/attendance")
                            }
                            style={menuButtonStyle}
                        >
                            📅
                            <span>Attendance</span>
                        </button>

                        {/* Calendar */}

                        <button
                            onClick={() =>
                                goTo("/calendar")
                            }
                            style={menuButtonStyle}
                        >
                            🗓️
                            <span>Calendar</span>
                        </button>

                        {/* Reports */}

                        <button
                            onClick={() =>
                                goTo("/reports")
                            }
                            style={menuButtonStyle}
                        >
                            📋
                            <span>Reports</span>
                        </button>

                        {/* AI Chat */}

                        <button
                            onClick={() =>
                                goTo("/ai/chat")
                            }
                            style={menuButtonStyle}
                        >
                            🤖
                            <span>AI Chat</span>
                        </button>
                    </nav>
                </aside>

                {/* =================================================
                    PAGE CONTENT
                ================================================= */}

                <main
                    style={{
                        flex: 1,
                        padding: "38px 35px",
                        boxSizing: "border-box",
                        overflowX: "auto",
                    }}
                >
                    {/* Page Header */}

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "28px",
                        }}
                    >
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "34px",
                                fontWeight: "400",
                                color: "#111",
                            }}
                        >
                            Announcement Management
                        </h1>

                        <button
                            onClick={addAnnouncement}
                            style={{
                                backgroundColor: "#198754",
                                border: "none",
                                color: "white",
                                padding: "11px 18px",
                                borderRadius: "6px",
                                fontSize: "16px",
                                cursor: "pointer",
                            }}
                        >
                            Add Announcement
                        </button>
                    </div>

                    {/* =================================================
                        FILTER CARD
                    ================================================= */}

                    <div
                        style={{
                            backgroundColor: "white",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            padding: "18px",
                            boxShadow:
                                "0 8px 18px rgba(0,0,0,0.10)",
                            marginBottom: "24px",
                        }}
                    >
                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "1.4fr 1fr 0.8fr 0.8fr auto",
                                gap: "16px",
                                alignItems: "center",
                            }}
                        >
                            {/* Search */}

                            <input
                                type="text"
                                placeholder="Search Title or Message..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                                style={inputStyle}
                            />

                            {/* Course */}

                            <select
                                value={courseFilter}
                                onChange={(e) =>
                                    setCourseFilter(
                                        e.target.value
                                    )
                                }
                                style={inputStyle}
                            >
                                <option value="">
                                    All Courses
                                </option>

                                {courses.map((course) => (
                                    <option
                                        key={course}
                                        value={course}
                                    >
                                        {course}
                                    </option>
                                ))}
                            </select>

                            {/* Message */}

                            <select
                                value={messageFilter}
                                onChange={(e) =>
                                    setMessageFilter(
                                        e.target.value
                                    )
                                }
                                style={inputStyle}
                            >
                                <option value="">
                                    All Messages
                                </option>

                                <option value="with">
                                    With Message
                                </option>

                                <option value="without">
                                    Without Message
                                </option>
                            </select>

                            {/* Sort */}

                            <select
                                value={sortOrder}
                                onChange={(e) =>
                                    setSortOrder(
                                        e.target.value
                                    )
                                }
                                style={inputStyle}
                            >
                                <option value="asc">
                                    Title (A-Z)
                                </option>

                                <option value="desc">
                                    Title (Z-A)
                                </option>
                            </select>

                            {/* Reset */}

                            <button
                                onClick={resetFilters}
                                style={{
                                    backgroundColor: "#6c757d",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    padding: "11px 18px",
                                    fontSize: "15px",
                                    cursor: "pointer",
                                }}
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    {/* =================================================
                        TOTAL
                    ================================================= */}

                    <div
                        style={{
                            display: "inline-block",
                            backgroundColor: "#0d6efd",
                            color: "white",
                            fontWeight: "600",
                            padding: "7px 13px",
                            borderRadius: "5px",
                            marginBottom: "16px",
                        }}
                    >
                        Total Announcements:{" "}
                        {filteredAnnouncements.length}
                    </div>

                    {/* =================================================
                        TABLE CARD
                    ================================================= */}

                    <div
                        style={{
                            backgroundColor: "white",
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            padding: "16px",
                            boxShadow:
                                "0 8px 18px rgba(0,0,0,0.10)",
                            overflowX: "auto",
                        }}
                    >
                        {loading ? (
                            <div
                                style={{
                                    textAlign: "center",
                                    padding: "40px",
                                    fontSize: "17px",
                                }}
                            >
                                Loading announcements...
                            </div>
                        ) : (
                            <table
                                style={{
                                    width: "100%",
                                    borderCollapse:
                                        "collapse",
                                    minWidth: "850px",
                                }}
                            >
                                <thead>
                                    <tr>
                                        <th style={thStyle}>
                                            Course
                                        </th>

                                        <th style={thStyle}>
                                            Title
                                        </th>

                                        <th style={thStyle}>
                                            Message
                                        </th>

                                        <th style={thStyle}>
                                            Created At
                                        </th>

                                        <th style={thStyle}>
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredAnnouncements.length ===
                                    0 ? (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                style={{
                                                    textAlign:
                                                        "center",
                                                    padding:
                                                        "25px",
                                                    border:
                                                        "1px solid #ddd",
                                                }}
                                            >
                                                No announcements
                                                found.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredAnnouncements.map(
                                            (
                                                announcement
                                            ) => (
                                                <tr
                                                    key={
                                                        announcement.id
                                                    }
                                                >
                                                    {/* COURSE */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        <strong>
                                                            {announcement.courseTitle ||
                                                                "No Course"}
                                                        </strong>
                                                    </td>

                                                    {/* TITLE */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        <strong>
                                                            {announcement.title ||
                                                                "-"}
                                                        </strong>
                                                    </td>

                                                    {/* MESSAGE */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {announcement.message ||
                                                            "-"}
                                                    </td>

                                                    {/* DATE */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        {formatDate(
                                                            announcement.createdAt
                                                        )}
                                                    </td>

                                                    {/* ACTIONS */}

                                                    <td
                                                        style={
                                                            tdStyle
                                                        }
                                                    >
                                                        <div
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                gap: "8px",
                                                                flexWrap:
                                                                    "wrap",
                                                            }}
                                                        >
                                                            <button
                                                                onClick={() =>
                                                                    editAnnouncement(
                                                                        announcement.id
                                                                    )
                                                                }
                                                                style={{
                                                                    backgroundColor:
                                                                        "#ffc107",
                                                                    color: "#111",
                                                                    border: "none",
                                                                    padding:
                                                                        "8px 13px",
                                                                    borderRadius:
                                                                        "5px",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    deleteAnnouncement(
                                                                        announcement.id
                                                                    )
                                                                }
                                                                style={{
                                                                    backgroundColor:
                                                                        "#dc3545",
                                                                    color: "white",
                                                                    border: "none",
                                                                    padding:
                                                                        "8px 13px",
                                                                    borderRadius:
                                                                        "5px",
                                                                    cursor: "pointer",
                                                                }}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}

// =====================================================
// STYLES
// =====================================================

const menuButtonStyle = {
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    backgroundColor: "transparent",
    color: "white",
    border: "none",
    padding: "10px 16px",
    fontSize: "16px",
    textAlign: "left",
    cursor: "pointer",
    marginBottom: "2px",
};

const inputStyle = {
    width: "100%",
    height: "40px",
    boxSizing: "border-box",
    border: "1px solid #ced4da",
    borderRadius: "6px",
    padding: "8px 12px",
    fontSize: "15px",
    backgroundColor: "white",
};

const thStyle = {
    backgroundColor: "#212529",
    color: "white",
    padding: "12px 10px",
    textAlign: "left",
    border: "1px solid #343a40",
    fontSize: "16px",
};

const tdStyle = {
    padding: "11px 9px",
    border: "1px solid #ddd",
    verticalAlign: "middle",
    fontSize: "16px",
};

export default AnnouncementList;