import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import SubjectService from "../../services/SubjectService";
import EnrollmentService from "../../services/EnrollmentService";
import { getUser } from "../../utils/localStorage";

function SubjectList() {

    // =====================================================
    // SUBJECTS
    // =====================================================

    const [subjects, setSubjects] = useState([]);

    const [filteredSubjects, setFilteredSubjects] =
        useState([]);


    // =====================================================
    // FILTERS
    // =====================================================

    const [search, setSearch] =
        useState("");

    const [courseFilter, setCourseFilter] =
        useState("");

    const [sortBy, setSortBy] =
        useState("NAME_ASC");


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
    // LOAD
    // =====================================================

    useEffect(() => {

        loadSubjects();

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);


    // =====================================================
    // FILTER
    // =====================================================

    useEffect(() => {

        filterSubjects();

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [
        subjects,
        search,
        courseFilter,
        sortBy
    ]);


    // =====================================================
    // LOAD SUBJECTS
    // =====================================================

    const loadSubjects = async () => {

        try {

            setLoading(true);


            // =================================================
            // GET ALL SUBJECTS
            // =================================================

            const response =
                await SubjectService.getAllSubjects();


            let allSubjects =
                Array.isArray(response.data)
                    ? response.data
                    : [];


            console.log(
                "All Subjects:",
                allSubjects
            );


            // =================================================
            // STUDENT FILTER
            // =================================================

            if (isStudent) {

                if (!studentId) {

                    console.warn(
                        "Student ID not found."
                    );

                    setSubjects([]);

                    return;
                }


                // -------------------------------------------------
                // GET STUDENT ENROLLED COURSE IDS
                // -------------------------------------------------

                const enrollmentResponse =
                    await EnrollmentService
                        .getStudentCourseIds(
                            studentId
                        );


                /*
                 * Backend should return:
                 *
                 * [1, 3, 5]
                 *
                 */

                const enrolledCourseIds =
                    Array.isArray(
                        enrollmentResponse.data
                    )
                        ? enrollmentResponse.data
                            .map(
                                id => Number(id)
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
                // FILTER SUBJECTS
                // -------------------------------------------------

                allSubjects =
                    allSubjects.filter(
                        subject => {

                            const courseId =
                                subject?.courseId ??
                                subject?.course?.id;


                            if (
                                courseId == null
                            ) {

                                return false;

                            }


                            return enrolledCourseIds.includes(
                                Number(courseId)
                            );

                        }
                    );


                console.log(
                    "Student Subjects:",
                    allSubjects
                );

            }


            // =================================================
            // SAVE
            // =================================================

            setSubjects(
                allSubjects
            );


        } catch (error) {

            console.error(
                "Unable to load subjects:",
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


            setSubjects([]);


            if (
                error?.response?.status === 403
            ) {

                alert(
                    "You are not authorized to access enrollment information."
                );

            } else {

                alert(
                    "Unable to load subjects."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FILTER SUBJECTS
    // =====================================================

    const filterSubjects = () => {

        let filtered =
            [...subjects];


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
                    subject =>

                        (
                            subject.name ||
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )

                        ||

                        (
                            subject.courseTitle ||
                            ""
                        )
                            .toLowerCase()
                            .includes(
                                searchText
                            )
                );

        }


        // =================================================
        // COURSE FILTER
        // =================================================

        if (
            courseFilter !== ""
        ) {

            filtered =
                filtered.filter(
                    subject =>
                        subject.courseTitle ===
                        courseFilter
                );

        }


        // =================================================
        // SORT
        // =================================================

        switch (sortBy) {

            case "NAME_ASC":

                filtered.sort(
                    (a, b) =>
                        (
                            a.name || ""
                        ).localeCompare(
                            b.name || ""
                        )
                );

                break;


            case "NAME_DESC":

                filtered.sort(
                    (a, b) =>
                        (
                            b.name || ""
                        ).localeCompare(
                            a.name || ""
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


        setFilteredSubjects(
            filtered
        );

    };


    // =====================================================
    // RESET
    // =====================================================

    const resetFilters = () => {

        setSearch("");

        setCourseFilter("");

        setSortBy(
            "NAME_ASC"
        );

    };


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (
        id
    ) => {

        if (
            !window.confirm(
                "Delete this subject?"
            )
        ) {

            return;

        }


        try {

            await SubjectService.deleteSubject(
                id
            );


            alert(
                "Subject deleted successfully."
            );


            loadSubjects();


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
                            Loading subjects...
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
                                ? "My Subjects"
                                : "Subject Management"
                            }

                        </h2>


                        {isStudent && (

                            <p className="text-muted mb-0">

                                Showing subjects from your
                                enrolled courses only.

                            </p>

                        )}

                    </div>


                    {/* =================================================
                        ADD SUBJECT
                    ================================================= */}

                    {!isStudent && (

                        <Link
                            to="/subjects/add"
                            className="btn btn-success"
                        >

                            + Add Subject

                        </Link>

                    )}

                </div>


                {/* =================================================
                    CARD
                ================================================= */}

                <div className="card shadow">

                    <div className="card-body">


                        {/* =================================================
                            FILTERS
                        ================================================= */}

                        <div className="row mb-3">


                            {/* SEARCH */}

                            <div className="col-md-4">

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search Subject..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* COURSE */}

                            <div className="col-md-3">

                                <select
                                    className="form-select"
                                    value={courseFilter}
                                    onChange={(e) =>
                                        setCourseFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        All Courses
                                    </option>


                                    {[
                                        ...new Set(
                                            subjects
                                                .map(
                                                    subject =>
                                                        subject.courseTitle
                                                )
                                                .filter(
                                                    Boolean
                                                )
                                        )
                                    ].map(
                                        course => (

                                            <option
                                                key={
                                                    course
                                                }
                                                value={
                                                    course
                                                }
                                            >

                                                {course}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* SORT */}

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

                                    <option value="NAME_ASC">
                                        Subject (A-Z)
                                    </option>

                                    <option value="NAME_DESC">
                                        Subject (Z-A)
                                    </option>

                                    <option value="ID_ASC">
                                        ID (Ascending)
                                    </option>

                                    <option value="ID_DESC">
                                        ID (Descending)
                                    </option>

                                </select>

                            </div>


                            {/* RESET */}

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
                                    ? "My Subjects"
                                    : "Total Subjects"
                                }

                                {" : "}

                                {
                                    filteredSubjects.length
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
                                            Subject Name
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

                                    {filteredSubjects.length >
                                    0 ? (

                                        filteredSubjects.map(
                                            subject => (

                                                <tr
                                                    key={
                                                        subject.id
                                                    }
                                                >

                                                    <td>
                                                        {
                                                            subject.id
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            subject.name
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            subject.courseTitle ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td>

                                                        {/* =================================
                                                            STUDENT
                                                        ================================= */}

                                                        {isStudent ? (

                                                            <Link
                                                                to={`/subjects/${subject.id}`}
                                                                className="btn btn-primary btn-sm"
                                                            >

                                                                View Subject

                                                            </Link>

                                                        ) : (

                                                            <>

                                                                {/* =============================
                                                                    ADMIN / TEACHER
                                                                ============================= */}

                                                                <Link
                                                                    to={`/subjects/edit/${subject.id}`}
                                                                    className="btn btn-warning btn-sm me-2"
                                                                >

                                                                    Edit

                                                                </Link>


                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            subject.id
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
                                                className="text-center"
                                            >

                                                {isStudent
                                                    ? "No subjects are available for your enrolled courses."
                                                    : "No subjects found."
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

export default SubjectList;