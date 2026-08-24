import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import EnrollmentService from "../../services/EnrollmentService";

function EnrollmentList() {

    // ================= STATES =================

    const [enrollments, setEnrollments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [courseFilter, setCourseFilter] = useState("");

    const [dateFilter, setDateFilter] = useState("");

    // ================= LOAD DATA =================

    useEffect(() => {

        loadEnrollments();

    }, []);

    const loadEnrollments = async () => {

        setLoading(true);

        try {

            const response =
                await EnrollmentService.getAllEnrollments();

            setEnrollments(response.data);

        }

        catch (error) {

            console.error(error);

            alert("Unable to load enrollments.");

        }

        finally {

            setLoading(false);

        }

    };

    // ================= DELETE =================

    const deleteEnrollment = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this enrollment?"
        );

        if (!confirmDelete) return;

        try {

            await EnrollmentService.deleteEnrollment(id);

            alert("Enrollment deleted successfully.");

            loadEnrollments();

        }

        catch (error) {

            console.error(error);

            alert("Delete failed.");

        }

    };

    // ================= FILTER =================

    const filteredEnrollments = useMemo(() => {

        return enrollments.filter((enrollment) => {

            const studentName =
                enrollment.student?.fullName?.toLowerCase() || "";

            const studentEmail =
                enrollment.student?.email?.toLowerCase() || "";

            const courseTitle =
                enrollment.course?.title || "";

            const matchesSearch =

                studentName.includes(
                    search.toLowerCase()
                ) ||

                studentEmail.includes(
                    search.toLowerCase()
                );

            const matchesCourse =

                courseFilter === "" ||

                courseTitle === courseFilter;

            const matchesDate =

                dateFilter === "" ||

                enrollment.enrollmentDate === dateFilter;

            return (

                matchesSearch &&

                matchesCourse &&

                matchesDate

            );

        });

    }, [

        enrollments,

        search,

        courseFilter,

        dateFilter

    ]);

    // ================= COURSE DROPDOWN =================

    const courses = [

        ...new Set(

            enrollments.map(

                enrollment => enrollment.course?.title

            )

        )

    ].filter(Boolean);

    return (

        <DashboardLayout>

            <div className="container mt-4">

                                {/* ================= HEADER ================= */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <div className="row g-3 align-items-end">

                            {/* Search */}

                            <div className="col-lg-4">

                                <label className="form-label fw-bold">

                                    Search Student

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by name or email..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />

                            </div>

                            {/* Course Filter */}

                            <div className="col-lg-3">

                                <label className="form-label fw-bold">

                                    Course

                                </label>

                                <select
                                    className="form-select"
                                    value={courseFilter}
                                    onChange={(e) =>
                                        setCourseFilter(e.target.value)
                                    }
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

                            </div>

                            {/* Date Filter */}

                            <div className="col-lg-3">

                                <label className="form-label fw-bold">

                                    Enrollment Date

                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    value={dateFilter}
                                    onChange={(e) =>
                                        setDateFilter(e.target.value)
                                    }
                                />

                            </div>

                            {/* Reset */}

                            <div className="col-lg-2 d-grid">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {

                                        setSearch("");

                                        setCourseFilter("");

                                        setDateFilter("");

                                    }}
                                >

                                    <i className="bi bi-arrow-counterclockwise me-1"></i>

                                    Reset

                                </button>

                            </div>

                        </div>

                        <hr />

                        <div className="d-flex justify-content-between align-items-center">

                            <div>

                                <h2 className="mb-1">

                                    Enrollment Management

                                </h2>

                                <span className="badge bg-primary">

                                    Total Records :
                                    {" "}
                                    {filteredEnrollments.length}

                                </span>

                            </div>

                            <div>

                                <button
                                    className="btn btn-outline-primary me-2"
                                    onClick={loadEnrollments}
                                >

                                    <i className="bi bi-arrow-clockwise me-1"></i>

                                    Refresh

                                </button>

                                <Link
                                    to="/enrollments/add"
                                    className="btn btn-success"
                                >

                                    <i className="bi bi-plus-circle me-1"></i>

                                    Enroll Student

                                </Link>

                            </div>

                        </div>

                    </div>

                </div>

                {/* ================= TABLE ================= */}

                <div className="card shadow">

                    <div className="card-body">                        {loading ? (

                            <div className="text-center py-5">

                                <div className="spinner-border text-primary"></div>

                                <p className="mt-3">

                                    Loading enrollments...

                                </p>

                            </div>

                        ) : (

                            <table className="table table-bordered table-hover align-middle">

                                <thead className="table-dark">

                                    <tr>

                                        <th>#</th>

                                        <th>ID</th>

                                        <th>Student</th>

                                        <th>Email</th>

                                        <th>Course</th>

                                        <th>Enrollment Date</th>

                                        <th width="180">

                                            Actions

                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {filteredEnrollments.length > 0 ? (

                                        filteredEnrollments.map(

                                            (enrollment, index) => (

                                                <tr key={enrollment.id}>

                                                    <td>

                                                        {index + 1}

                                                    </td>

                                                    <td>

                                                        {enrollment.id}

                                                    </td>

                                                    <td>

                                                        {enrollment.student?.fullName}

                                                    </td>

                                                    <td>

                                                        {enrollment.student?.email}

                                                    </td>

                                                    <td>

                                                        <span className="badge bg-info text-dark">

                                                            {enrollment.course?.title}

                                                        </span>

                                                    </td>

                                                    <td>

                                                        {enrollment.enrollmentDate}

                                                    </td>

                                                    <td>

                                                        <Link
                                                            to={`/enrollments/edit/${enrollment.id}`}
                                                            className="btn btn-warning btn-sm me-2"
                                                        >

                                                            <i className="bi bi-pencil-square"></i>

                                                        </Link>

                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() =>
                                                                deleteEnrollment(
                                                                    enrollment.id
                                                                )
                                                            }
                                                        >

                                                            <i className="bi bi-trash"></i>

                                                        </button>

                                                    </td>

                                                </tr>

                                            )

                                        )

                                    ) : (

                                        <tr>

                                            <td
                                                colSpan="7"
                                                className="text-center py-5"
                                            >

                                                <h5 className="text-muted">

                                                    No enrollments found.

                                                </h5>

                                            </td>

                                        </tr>

                                    )}

                                </tbody>

                            </table>

                        )}</div>
                                            </div>

                </div>

          

        </DashboardLayout>

    );

}

export default EnrollmentList;