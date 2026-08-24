import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import LearningResourceService
    from "../../services/LearningResourceService";

import EnrollmentService
    from "../../services/EnrollmentService";

import { getUser } from "../../utils/localStorage";


function ResourceList() {

    // =====================================================
    // RESOURCES
    // =====================================================

    const [resources, setResources] =
        useState([]);

    const [filteredResources, setFilteredResources] =
        useState([]);


    // =====================================================
    // FILTERS
    // =====================================================

    const [search, setSearch] =
        useState("");

    const [typeFilter, setTypeFilter] =
        useState("");

    const [courseFilter, setCourseFilter] =
        useState("");


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
    // LOAD RESOURCES
    // =====================================================

    useEffect(() => {

        loadResources();

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, []);


    // =====================================================
    // FILTER
    // =====================================================

    useEffect(() => {

        filterResources();

        // eslint-disable-next-line react-hooks/exhaustive-deps

    }, [
        resources,
        search,
        typeFilter,
        courseFilter
    ]);


    // =====================================================
    // LOAD RESOURCES
    // =====================================================

    const loadResources = async () => {

        try {

            setLoading(true);


            // =================================================
            // GET ALL RESOURCES
            // =================================================

            const resourceResponse =
                await LearningResourceService
                    .getAllResources();


            let allResources =
                Array.isArray(
                    resourceResponse.data
                )
                    ? resourceResponse.data
                    : [];


            console.log(
                "All Resources:",
                allResources
            );


            // =================================================
            // STUDENT FILTER
            // =================================================

            if (isStudent) {

                // -------------------------------------------------
                // STUDENT ID
                // -------------------------------------------------

                if (!studentId) {

                    console.warn(
                        "Student ID not found."
                    );

                    setResources([]);

                    return;
                }


                // -------------------------------------------------
                // GET ENROLLED COURSES
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
                // [1, 3]
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
                // ONLY RESOURCES FROM ENROLLED COURSES
                // -------------------------------------------------

                allResources =
                    allResources.filter(
                        (resource) => {

                            const courseId =
                                resource?.courseId;


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
                    "Student Resources:",
                    allResources
                );

            }


            // =================================================
            // SAVE
            // =================================================

            setResources(
                allResources
            );


        } catch (error) {

            console.error(
                "Unable to load resources:",
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


            setResources([]);


            // =================================================
            // 403
            // =================================================

            if (
                error?.response?.status === 403
            ) {

                alert(
                    "You are not authorized to access your course enrollment information."
                );

            } else {

                alert(
                    "Unable to load resources."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FILTER RESOURCES
    // =====================================================

    const filterResources = () => {

        let filtered =
            [...resources];


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
                    (resource) => {

                        const title =
                            resource?.title ||
                            "";


                        const description =
                            resource?.description ||
                            "";


                        const topicTitle =
                            resource?.topicTitle ||
                            "";


                        const courseTitle =
                            resource?.courseTitle ||
                            "";


                        return (

                            title
                                .toLowerCase()
                                .includes(
                                    searchText
                                )

                            ||

                            description
                                .toLowerCase()
                                .includes(
                                    searchText
                                )

                            ||

                            topicTitle
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
        // TYPE FILTER
        // =================================================

        if (
            typeFilter !== ""
        ) {

            filtered =
                filtered.filter(
                    resource =>
                        resource.resourceType ===
                        typeFilter
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
                    resource =>
                        String(
                            resource.courseId
                        ) ===
                        String(
                            courseFilter
                        )
                );

        }


        setFilteredResources(
            filtered
        );

    };


    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {

        setSearch("");

        setTypeFilter("");

        setCourseFilter("");

    };


    // =====================================================
    // DELETE RESOURCE
    // =====================================================

    const handleDelete = async (
        id
    ) => {

        if (
            !window.confirm(
                "Delete this resource?"
            )
        ) {

            return;

        }


        try {

            await LearningResourceService
                .deleteResource(
                    id
                );


            alert(
                "Resource deleted successfully."
            );


            loadResources();


        } catch (error) {

            console.error(
                "Delete failed:",
                error
            );


            alert(
                "Unable to delete resource."
            );

        }

    };


    // =====================================================
    // RESOURCE TYPE
    // =====================================================

    const getResourceType =
        (resource) => {

            return (
                resource?.resourceType ||
                "OTHER"
            );

        };


    // =====================================================
    // VIEW RESOURCE
    // =====================================================

    const getResourceUrl =
        (resource) => {

            return (
                resource?.resourceUrl ||
                "#"
            );

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
                            Loading resources...
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
                                ? "My Learning Resources"
                                : "Learning Resources"
                            }

                        </h2>


                        {isStudent && (

                            <p className="text-muted mb-0">

                                Resources from your
                                enrolled courses only.

                            </p>

                        )}

                    </div>


                    {/* =================================================
                        ADD RESOURCE
                    ================================================= */}

                    {!isStudent && (

                        <Link
                            to="/resources/add"
                            className="btn btn-success"
                        >

                            + Add Resource

                        </Link>

                    )}

                </div>


                {/* =================================================
                    STUDENT NOTICE
                ================================================= */}

                {isStudent && (

                    <div className="alert alert-info">

                        You can only access learning resources
                        from courses you are enrolled in.

                    </div>

                )}


                {/* =================================================
                    FILTER CARD
                ================================================= */}

                <div className="card shadow mb-4">

                    <div className="card-body">

                        <div className="row g-3">


                            {/* =================================================
                                SEARCH
                            ================================================= */}

                            <div className="col-md-4">

                                <label className="form-label">

                                    Search

                                </label>


                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search resources..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>


                            {/* =================================================
                                RESOURCE TYPE
                            ================================================= */}

                            <div className="col-md-3">

                                <label className="form-label">

                                    Resource Type

                                </label>


                                <select
                                    className="form-select"
                                    value={typeFilter}
                                    onChange={(e) =>
                                        setTypeFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        All Types
                                    </option>

                                    <option value="VIDEO">
                                        Video
                                    </option>

                                    <option value="LINK">
                                        Link
                                    </option>

                                    <option value="PDF">
                                        PDF
                                    </option>

                                    <option value="PPT">
                                        PPT
                                    </option>

                                </select>

                            </div>


                            {/* =================================================
                                COURSE
                            ================================================= */}

                            <div className="col-md-3">

                                <label className="form-label">

                                    Course

                                </label>


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
                                        ...new Map(

                                            resources
                                                .filter(
                                                    resource =>
                                                        resource.courseId != null
                                                )
                                                .map(
                                                    resource => [
                                                        resource.courseId,
                                                        resource.courseTitle
                                                    ]
                                                )

                                        ).entries()

                                    ].map(
                                        ([id, title]) => (

                                            <option
                                                key={id}
                                                value={id}
                                            >

                                                {title}

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* =================================================
                                RESET
                            ================================================= */}

                            <div className="col-md-2 d-flex align-items-end">

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

                    </div>

                </div>


                {/* =================================================
                    RESOURCE COUNT
                ================================================= */}

                <div className="mb-3">

                    <span className="badge bg-primary fs-6">

                        Resources: {
                            filteredResources.length
                        }

                    </span>

                </div>


                {/* =================================================
                    RESOURCE TABLE
                ================================================= */}

                <div className="card shadow">

                    <div className="card-body">

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
                                            Type
                                        </th>

                                        <th>
                                            Topic
                                        </th>

                                        <th>
                                            Course
                                        </th>

                                        <th>
                                            Description
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredResources.length > 0 ? (

                                        filteredResources.map(
                                            (resource) => (

                                                <tr
                                                    key={
                                                        resource.id
                                                    }
                                                >

                                                    {/* ID */}

                                                    <td>
                                                        {
                                                            resource.id
                                                        }
                                                    </td>


                                                    {/* TITLE */}

                                                    <td>

                                                        <strong>
                                                            {
                                                                resource.title
                                                            }
                                                        </strong>

                                                    </td>


                                                    {/* TYPE */}

                                                    <td>

                                                        <span
                                                            className={
                                                                getResourceType(
                                                                    resource
                                                                ) === "VIDEO"

                                                                    ? "badge bg-danger"

                                                                    : getResourceType(
                                                                        resource
                                                                    ) === "PDF"

                                                                        ? "badge bg-danger"

                                                                        : getResourceType(
                                                                            resource
                                                                        ) === "PPT"

                                                                            ? "badge bg-warning text-dark"

                                                                            : "badge bg-primary"
                                                            }
                                                        >

                                                            {
                                                                getResourceType(
                                                                    resource
                                                                )
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* TOPIC */}

                                                    <td>

                                                        {
                                                            resource.topicTitle ||
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* COURSE */}

                                                    <td>

                                                        {
                                                            resource.courseTitle ||
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* DESCRIPTION */}

                                                    <td>

                                                        {
                                                            resource.description ||
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* ACTIONS */}

                                                    <td>

                                                        {/* VIEW */}

                                                        {resource.resourceUrl &&
                                                        resource.resourceUrl !== "#" && (

                                                            <a
                                                                href={
                                                                    getResourceUrl(
                                                                        resource
                                                                    )
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="btn btn-primary btn-sm me-2"
                                                            >

                                                                View

                                                            </a>

                                                        )}


                                                        {/* ADMIN / TEACHER */}

                                                        {!isStudent && (

                                                            <>

                                                                <Link
                                                                    to={`/resources/edit/${resource.id}`}
                                                                    className="btn btn-warning btn-sm me-2"
                                                                >

                                                                    Edit

                                                                </Link>


                                                                <button
                                                                    type="button"
                                                                    className="btn btn-danger btn-sm"
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            resource.id
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
                                                colSpan="7"
                                                className="text-center py-4"
                                            >

                                                {isStudent

                                                    ? "No learning resources are available for your enrolled courses."

                                                    : "No resources found."

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


export default ResourceList;