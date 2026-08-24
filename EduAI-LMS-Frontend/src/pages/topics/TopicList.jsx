import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import TopicService from "../../services/TopicService";
import EnrollmentService from "../../services/EnrollmentService";

import { getUser } from "../../utils/localStorage";

function TopicList() {

    // =====================================================
    // TOPICS
    // =====================================================

    const [topics, setTopics] = useState([]);

    const [filteredTopics, setFilteredTopics] =
        useState([]);


    // =====================================================
    // FILTERS
    // =====================================================

    const [search, setSearch] =
        useState("");

    const [subjectFilter, setSubjectFilter] =
        useState("");

    const [sortBy, setSortBy] =
        useState("TITLE_ASC");


    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // USER
    // =====================================================

    const user = getUser();

    const studentId =
        user?.id ??
        user?.userId ??
        user?.studentId ??
        null;


    const role =
        String(user?.role ?? "")
            .replace("ROLE_", "")
            .toUpperCase();


    const isStudent =
        role === "STUDENT";


    // =====================================================
    // LOAD TOPICS
    // =====================================================

    useEffect(() => {

        loadTopics();

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);


    // =====================================================
    // FILTER TOPICS
    // =====================================================

    useEffect(() => {

        filterTopics();

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [
        topics,
        search,
        subjectFilter,
        sortBy
    ]);


    // =====================================================
    // LOAD TOPICS
    // =====================================================

    const loadTopics = async () => {

        try {

            setLoading(true);


            // =================================================
            // GET ALL TOPICS
            // =================================================

            const response =
                await TopicService.getAllTopics();


            let allTopics =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            console.log(
                "All Topics:",
                allTopics
            );


            // =================================================
            // STUDENT FILTER
            // =================================================

            if (isStudent) {

                // -------------------------------------------------
                // CHECK STUDENT ID
                // -------------------------------------------------

                if (!studentId) {

                    console.warn(
                        "Student ID not found."
                    );

                    setTopics([]);

                    return;

                }


                // -------------------------------------------------
                // GET STUDENT ENROLLED COURSES
                // -------------------------------------------------

                const enrollmentResponse =
                    await EnrollmentService
                        .getStudentCourseIds(
                            studentId
                        );


                // IMPORTANT:
                //
                // Axios response:
                //
                // enrollmentResponse.data
                //
                // Example:
                //
                // [1, 3, 5]
                //
                // -------------------------------------------------

                const enrolledCourseIds =
                    Array.isArray(
                        enrollmentResponse.data
                    )
                        ? enrollmentResponse.data
                            .map(
                                id =>
                                    Number(id)
                            )
                            .filter(
                                id =>
                                    Number.isFinite(id)
                            )
                        : [];


                console.log(
                    "Student ID:",
                    studentId
                );


                console.log(
                    "Enrolled Course IDs:",
                    enrolledCourseIds
                );


                // -------------------------------------------------
                // FILTER TOPICS BY ENROLLED COURSE
                // -------------------------------------------------

                allTopics =
                    allTopics.filter(
                        (topic) => {

                            const courseId =
                                topic?.courseId;


                            if (
                                courseId === null ||
                                courseId === undefined
                            ) {

                                return false;

                            }


                            return enrolledCourseIds.includes(
                                Number(courseId)
                            );

                        }
                    );


                console.log(
                    "Student Topics:",
                    allTopics
                );

            }


            // =================================================
            // SAVE TOPICS
            // =================================================

            setTopics(
                allTopics
            );


        } catch (error) {

            console.error(
                "Unable to load topics:",
                error
            );


            console.error(
                "Status:",
                error?.response?.status
            );


            console.error(
                "Response:",
                error?.response?.data
            );


            setTopics([]);


            // -------------------------------------------------
            // 403
            // -------------------------------------------------

            if (
                error?.response?.status === 403
            ) {

                alert(
                    "You are not authorized to access your enrollment information."
                );

            } else {

                alert(
                    "Unable to load topics."
                );

            }


        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FILTER TOPICS
    // =====================================================

    const filterTopics = () => {

        let filtered =
            [...topics];


        // =================================================
        // SEARCH
        // =================================================

        if (
            search.trim() !== ""
        ) {

            const searchText =
                search.toLowerCase();


            filtered =
                filtered.filter(
                    (topic) => {

                        const title =
                            topic?.title ||
                            "";


                        const subjectName =
                            topic?.subjectName ||
                            "";


                        const courseTitle =
                            topic?.courseTitle ||
                            "";


                        return (

                            title
                                .toLowerCase()
                                .includes(
                                    searchText
                                )

                            ||

                            subjectName
                                .toLowerCase()
                                .includes(
                                    searchText
                                )

                            ||

                            courseTitle
                                .toLowerCase()
                                .includes(
                                    searchText
                                )

                        );

                    }
                );

        }


        // =================================================
        // SUBJECT FILTER
        // =================================================

        if (
            subjectFilter !== ""
        ) {

            filtered =
                filtered.filter(
                    (topic) =>
                        topic.subjectName ===
                        subjectFilter
                );

        }


        // =================================================
        // SORT
        // =================================================

        switch (sortBy) {


            // -------------------------------------------------
            // TITLE ASC
            // -------------------------------------------------

            case "TITLE_ASC":

                filtered.sort(
                    (a, b) =>
                        (
                            a.title || ""
                        ).localeCompare(
                            b.title || ""
                        )
                );

                break;


            // -------------------------------------------------
            // TITLE DESC
            // -------------------------------------------------

            case "TITLE_DESC":

                filtered.sort(
                    (a, b) =>
                        (
                            b.title || ""
                        ).localeCompare(
                            a.title || ""
                        )
                );

                break;


            // -------------------------------------------------
            // ID ASC
            // -------------------------------------------------

            case "ID_ASC":

                filtered.sort(
                    (a, b) =>
                        Number(a.id) -
                        Number(b.id)
                );

                break;


            // -------------------------------------------------
            // ID DESC
            // -------------------------------------------------

            case "ID_DESC":

                filtered.sort(
                    (a, b) =>
                        Number(b.id) -
                        Number(a.id)
                );

                break;


            default:

                break;

        }


        setFilteredTopics(
            filtered
        );

    };


    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {

        setSearch("");

        setSubjectFilter("");

        setSortBy(
            "TITLE_ASC"
        );

    };


    // =====================================================
    // DELETE TOPIC
    // =====================================================

    const handleDelete = async (
        id
    ) => {

        if (
            !window.confirm(
                "Delete this topic?"
            )
        ) {

            return;

        }


        try {

            await TopicService.deleteTopic(
                id
            );


            alert(
                "Topic deleted successfully."
            );


            loadTopics();


        } catch (error) {

            console.error(
                "Delete failed:",
                error
            );


            alert(
                "Delete failed."
            );

        }

    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <DashboardLayout>

                <div className="container mt-4">

                    <div className="text-center">

                        <div
                            className="spinner-border"
                            role="status"
                        />

                        <p className="mt-2">
                            Loading topics...
                        </p>

                    </div>

                </div>

            </DashboardLayout>

        );

    }


    // =====================================================
    // RETURN
    // =====================================================

    return (

        <DashboardLayout>

            <div className="container mt-4">


                {/* =================================================
                    HEADER
                ================================================= */}

                <div
                    className="d-flex justify-content-between align-items-center mb-4"
                >

                    <div>

                        <h2>

                            {isStudent
                                ? "My Topics"
                                : "Topic Management"
                            }

                        </h2>


                        {isStudent && (

                            <p className="text-muted mb-0">

                                Showing topics from your
                                enrolled courses only.

                            </p>

                        )}

                    </div>


                    {/* =================================================
                        ADD TOPIC
                    ================================================= */}

                    {!isStudent && (

                        <Link
                            to="/topics/add"
                            className="btn btn-success"
                        >

                            + Add Topic

                        </Link>

                    )}

                </div>


                {/* =================================================
                    STUDENT INFORMATION
                ================================================= */}

                {isStudent && (

                    <div className="alert alert-info">

                        You can only see topics belonging to
                        courses you are enrolled in.

                    </div>

                )}


                {/* =================================================
                    CARD
                ================================================= */}

                <div className="card shadow">

                    <div className="card-body">


                        {/* =================================================
                            FILTERS
                        ================================================= */}

                        <div className="row mb-3">


                            {/* =================================================
                                SEARCH
                            ================================================= */}

                            <div className="col-md-4">

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search Topic..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* =================================================
                                SUBJECT
                            ================================================= */}

                            <div className="col-md-3">

                                <select
                                    className="form-select"
                                    value={subjectFilter}
                                    onChange={(e) =>
                                        setSubjectFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        All Subjects
                                    </option>


                                    {[
                                        ...new Set(

                                            topics

                                                .map(
                                                    topic =>
                                                        topic.subjectName
                                                )

                                                .filter(
                                                    Boolean
                                                )

                                        )

                                    ].map(
                                        (subject) => (

                                            <option
                                                key={
                                                    subject
                                                }
                                                value={
                                                    subject
                                                }
                                            >

                                                {subject}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* =================================================
                                SORT
                            ================================================= */}

                            <div className="col-md-3">

                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={(e) =>
                                        setSortBy(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="TITLE_ASC">
                                        Title (A-Z)
                                    </option>

                                    <option value="TITLE_DESC">
                                        Title (Z-A)
                                    </option>

                                    <option value="ID_ASC">
                                        ID (Ascending)
                                    </option>

                                    <option value="ID_DESC">
                                        ID (Descending)
                                    </option>

                                </select>

                            </div>


                            {/* =================================================
                                RESET
                            ================================================= */}

                            <div className="col-md-2">

                                <button
                                    type="button"
                                    className="btn btn-secondary w-100"
                                    onClick={
                                        resetFilters
                                    }
                                >

                                    Reset

                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            COUNTER
                        ================================================= */}

                        <div className="mb-3">

                            <span className="badge bg-primary fs-6">

                                {isStudent
                                    ? "My Topics"
                                    : "Total Topics"
                                }

                                {" : "}

                                {
                                    filteredTopics.length
                                }

                            </span>

                        </div>


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        <div className="table-responsive">

                            <table
                                className="table table-bordered table-hover"
                            >

                                <thead className="table-dark">

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Title
                                        </th>

                                        <th>
                                            Subject
                                        </th>

                                        <th>
                                            Course
                                        </th>

                                        <th width="180">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredTopics.length > 0 ? (

                                        filteredTopics.map(
                                            (topic) => (

                                                <tr
                                                    key={
                                                        topic.id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            topic.id
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            topic.title
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            topic.subjectName ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            topic.courseTitle ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td>


                                                        {/* =================================================
                                                            STUDENT
                                                        ================================================= */}

                                                        {isStudent ? (

                                                            <Link
                                                                to={`/topics/${topic.id}`}
                                                                className="btn btn-primary btn-sm"
                                                            >

                                                                View Topic

                                                            </Link>

                                                        ) : (

                                                            <>


                                                                {/* =================================================
                                                                    ADMIN / TEACHER
                                                                ================================================= */}

                                                                <Link
                                                                    to={`/topics/edit/${topic.id}`}
                                                                    className="btn btn-warning btn-sm me-2"
                                                                >

                                                                    Edit

                                                                </Link>


                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            topic.id
                                                                        )
                                                                    }
                                                                >

                                                                    Delete

                                                                </button>


                                                            </>

                                                        )}

                                                    </td>

                                                </tr>

                                            )

                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="text-center py-4"
                                            >

                                                {isStudent

                                                    ? "No topics are available for your enrolled courses."

                                                    : "No topics found."

                                                }

                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default TopicList;