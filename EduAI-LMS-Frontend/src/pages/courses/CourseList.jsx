import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import CourseService from "../../services/CourseService";
import EnrollmentService from "../../services/EnrollmentService";

import { getUser } from "../../utils/localStorage";

function CourseList() {

    // =====================================================
    // COURSES
    // =====================================================

    const [courses, setCourses] = useState([]);

    const [filteredCourses, setFilteredCourses] =
        useState([]);


    // =====================================================
    // SEARCH / FILTER
    // =====================================================

    const [search, setSearch] =
        useState("");

    const [descriptionFilter, setDescriptionFilter] =
        useState("ALL");

    const [sortBy, setSortBy] =
        useState("TITLE_ASC");


    // =====================================================
    // LOADING
    // =====================================================

    const [loading, setLoading] =
        useState(true);


    // =====================================================
    // LOGGED-IN USER
    // =====================================================

    const user = getUser();

    const studentId =
        user?.id ??
        user?.userId ??
        user?.studentId ??
        null;

    const role =
        String(user?.role ?? "")
            .toUpperCase();

    const isStudent =
        role === "STUDENT";

    const isAdmin =
        role === "ADMIN";

    const isTeacher =
        role === "TEACHER";


    // =====================================================
    // LOAD COURSES ON PAGE LOAD
    // =====================================================

    useEffect(() => {

        loadCourses();

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);


    // =====================================================
    // APPLY FILTERS
    // =====================================================

    useEffect(() => {

        filterCourses();

    }, [
        courses,
        search,
        descriptionFilter,
        sortBy
    ]);


    // =====================================================
    // LOAD COURSES
    // =====================================================

    const loadCourses = async () => {

        try {

            setLoading(true);


            // =================================================
            // GET ALL COURSES
            // =================================================

            const response =
                await CourseService.getAllCourses();


            let allCourses =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            console.log(
                "All Courses:",
                allCourses
            );


            // =================================================
            // STUDENT
            // =================================================
            //
            // Students can only see courses they are enrolled in.
            //
            // =================================================

            if (isStudent) {

                // ---------------------------------------------
                // CHECK STUDENT ID
                // ---------------------------------------------

                if (!studentId) {

                    console.warn(
                        "Student ID not found."
                    );

                    setCourses([]);

                    return;
                }


                console.log(
                    "Student ID:",
                    studentId
                );


                // ---------------------------------------------
                // GET ENROLLED COURSE IDS
                // ---------------------------------------------

                const enrollmentResponse =
                    await EnrollmentService
                        .getStudentCourseIds(
                            studentId
                        );


                console.log(
                    "Enrollment Response:",
                    enrollmentResponse
                );


                // =================================================
                // IMPORTANT
                // =================================================
                //
                // Axios returns:
                //
                // {
                //     data: [2],
                //     status: 200,
                //     ...
                // }
                //
                // Therefore we MUST use:
                //
                // enrollmentResponse.data
                //
                // =================================================

                const enrolledCourseIds =
                    Array.isArray(
                        enrollmentResponse.data
                    )
                        ? enrollmentResponse.data.map(
                            id => Number(id)
                        )
                        : [];


                console.log(
                    "Enrolled Course IDs:",
                    enrolledCourseIds
                );


                // ---------------------------------------------
                // FILTER COURSES
                // ---------------------------------------------

                allCourses =
                    allCourses.filter(
                        course =>
                            enrolledCourseIds.includes(
                                Number(course.id)
                            )
                    );


                console.log(
                    "Student Courses:",
                    allCourses
                );
            }


            // =================================================
            // ADMIN / TEACHER
            // =================================================
            //
            // Admin and teacher can see all courses.
            //
            // =================================================

            setCourses(
                allCourses
            );


        } catch (error) {

            console.error(
                "Failed to load courses:",
                error
            );

            setCourses([]);

            alert(
                "Failed to load courses."
            );


        } finally {

            setLoading(false);
        }
    };


    // =====================================================
    // FILTER COURSES
    // =====================================================

    const filterCourses = () => {

        let filtered =
            [...courses];


        // =================================================
        // SEARCH
        // =================================================

        if (
            search.trim() !== ""
        ) {

            const searchText =
                search
                    .toLowerCase()
                    .trim();


            filtered =
                filtered.filter(
                    course =>

                        (
                            course.title ||
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        (
                            course.description ||
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )
                );
        }


        // =================================================
        // DESCRIPTION FILTER
        // =================================================

        if (
            descriptionFilter ===
            "WITH_DESCRIPTION"
        ) {

            filtered =
                filtered.filter(
                    course =>
                        course.description &&
                        course.description
                            .trim() !== ""
                );
        }


        if (
            descriptionFilter ===
            "WITHOUT_DESCRIPTION"
        ) {

            filtered =
                filtered.filter(
                    course =>
                        !course.description ||
                        course.description
                            .trim() === ""
                );
        }


        // =================================================
        // SORT
        // =================================================

        switch (sortBy) {

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


            case "ID_ASC":

                filtered.sort(
                    (a, b) =>
                        Number(a.id) -
                        Number(b.id)
                );

                break;


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


        setFilteredCourses(
            filtered
        );
    };


    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {

        setSearch("");

        setDescriptionFilter(
            "ALL"
        );

        setSortBy(
            "TITLE_ASC"
        );
    };


    // =====================================================
    // DELETE COURSE
    // =====================================================

    const handleDelete = async (
        id
    ) => {

        // -------------------------------------------------
        // STUDENTS CANNOT DELETE
        // -------------------------------------------------

        if (isStudent) {

            return;
        }


        // -------------------------------------------------
        // CONFIRM
        // -------------------------------------------------

        if (
            !window.confirm(
                "Are you sure you want to delete this course?"
            )
        ) {

            return;
        }


        try {

            await CourseService.deleteCourse(
                id
            );


            alert(
                "Course deleted successfully."
            );


            // Reload courses

            await loadCourses();


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
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (

            <DashboardLayout>

                <div className="container mt-4">

                    <div className="text-center">

                        <div
                            className="spinner-border"
                            role="status"
                        >
                        </div>


                        <p className="mt-2">

                            Loading courses...

                        </p>

                    </div>

                </div>

            </DashboardLayout>
        );
    }


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <DashboardLayout>

            <div className="container mt-4">


                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div
                    className="
                        d-flex
                        justify-content-between
                        align-items-center
                        mb-4
                    "
                >

                    <div>

                        <h2>

                            {isStudent
                                ? "My Courses"
                                : "Course Management"}

                        </h2>


                        {isStudent && (

                            <p className="text-muted mb-0">

                                Showing only courses
                                you are enrolled in.

                            </p>

                        )}

                    </div>


                    {/* ================================================= */}
                    {/* ADD COURSE */}
                    {/* ================================================= */}

                    {!isStudent && (

                        <Link
                            to="/courses/add"
                            className="btn btn-success"
                        >

                            + Add Course

                        </Link>

                    )}

                </div>


                {/* ================================================= */}
                {/* CARD */}
                {/* ================================================= */}

                <div className="card shadow">

                    <div className="card-body">


                        {/* ================================================= */}
                        {/* FILTERS */}
                        {/* ================================================= */}

                        <div className="row mb-3">


                            {/* ================================================= */}
                            {/* SEARCH */}
                            {/* ================================================= */}

                            <div className="col-md-4">

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search Course..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* ================================================= */}
                            {/* DESCRIPTION FILTER */}
                            {/* ================================================= */}

                            <div className="col-md-3">

                                <select
                                    className="form-select"
                                    value={
                                        descriptionFilter
                                    }
                                    onChange={(e) =>
                                        setDescriptionFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="ALL">
                                        All Descriptions
                                    </option>


                                    <option
                                        value="WITH_DESCRIPTION"
                                    >
                                        With Description
                                    </option>


                                    <option
                                        value="WITHOUT_DESCRIPTION"
                                    >
                                        Without Description
                                    </option>

                                </select>

                            </div>


                            {/* ================================================= */}
                            {/* SORT */}
                            {/* ================================================= */}

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


                            {/* ================================================= */}
                            {/* RESET */}
                            {/* ================================================= */}

                            <div className="col-md-2">

                                <button
                                    className="
                                        btn
                                        btn-secondary
                                        w-100
                                    "
                                    onClick={
                                        resetFilters
                                    }
                                >

                                    Reset

                                </button>

                            </div>

                        </div>


                        {/* ================================================= */}
                        {/* COURSE COUNT */}
                        {/* ================================================= */}

                        <div className="mb-3">

                            <span
                                className="
                                    badge
                                    bg-primary
                                    fs-6
                                "
                            >

                                {isStudent
                                    ? "My Courses"
                                    : "Total Courses"}

                                {" : "}

                                {
                                    filteredCourses.length
                                }

                            </span>

                        </div>


                        {/* ================================================= */}
                        {/* TABLE */}
                        {/* ================================================= */}

                        <div className="table-responsive">

                            <table
                                className="
                                    table
                                    table-bordered
                                    table-hover
                                "
                            >

                                <thead
                                    className="table-dark"
                                >

                                    <tr>

                                        <th>
                                            ID
                                        </th>


                                        <th>
                                            Title
                                        </th>


                                        <th>
                                            Description
                                        </th>


                                        <th width="180">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>


                                    {filteredCourses.length >
                                    0 ? (

                                        filteredCourses.map(
                                            (course) => (

                                                <tr
                                                    key={
                                                        course.id
                                                    }
                                                >


                                                    {/* ================================= */}
                                                    {/* ID */}
                                                    {/* ================================= */}

                                                    <td>

                                                        {
                                                            course.id
                                                        }

                                                    </td>


                                                    {/* ================================= */}
                                                    {/* TITLE */}
                                                    {/* ================================= */}

                                                    <td>

                                                        {
                                                            course.title
                                                        }

                                                    </td>


                                                    {/* ================================= */}
                                                    {/* DESCRIPTION */}
                                                    {/* ================================= */}

                                                    <td>

                                                        {
                                                            course.description
                                                                ? course.description
                                                                : "-"
                                                        }

                                                    </td>


                                                    {/* ================================= */}
                                                    {/* ACTIONS */}
                                                    {/* ================================= */}

                                                    <td>


                                                        {/* ================================= */}
                                                        {/* STUDENT */}
                                                        {/* ================================= */}

                                                        {isStudent ? (

                                                            <Link
                                                                to={`/courses/${course.id}`}
                                                                className="
                                                                    btn
                                                                    btn-primary
                                                                    btn-sm
                                                                "
                                                            >

                                                                View Course

                                                            </Link>

                                                        ) : (

                                                            <>


                                                                {/* ============================= */}
                                                                {/* EDIT */}
                                                                {/* ============================= */}

                                                                <Link
                                                                    to={`/courses/edit/${course.id}`}
                                                                    className="
                                                                        btn
                                                                        btn-warning
                                                                        btn-sm
                                                                        me-2
                                                                    "
                                                                >

                                                                    Edit

                                                                </Link>


                                                                {/* ============================= */}
                                                                {/* DELETE */}
                                                                {/* ============================= */}

                                                                <button
                                                                    className="
                                                                        btn
                                                                        btn-danger
                                                                        btn-sm
                                                                    "
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            course.id
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
                                                colSpan="4"
                                                className="
                                                    text-center
                                                    py-4
                                                "
                                            >

                                                {isStudent

                                                    ? "You are not enrolled in any courses yet."

                                                    : "No courses found."
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

export default CourseList;