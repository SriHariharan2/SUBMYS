import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import AttendanceService from "../../services/AttendanceService";

function AttendanceList() {

    const [attendanceList, setAttendanceList] = useState([]);
    const [filteredAttendance, setFilteredAttendance] = useState([]);

    const [search, setSearch] = useState("");
    const [studentFilter, setStudentFilter] = useState("");
    const [courseFilter, setCourseFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const [sortOrder, setSortOrder] = useState("DESC");

    useEffect(() => {
        loadAttendance();
    }, []);

    useEffect(() => {
        filterAttendance();
    }, [
        attendanceList,
        search,
        studentFilter,
        courseFilter,
        statusFilter,
        dateFilter,
        sortOrder
    ]);

    const loadAttendance = () => {

        AttendanceService.getAllAttendance()
            .then((response) => {

                setAttendanceList(response.data);

            })
            .catch(console.error);

    };

    const filterAttendance = () => {

        let filtered = [...attendanceList];

        // Search

        if (search.trim() !== "") {

            filtered = filtered.filter(attendance =>

                attendance.student?.fullName
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

                ||

                attendance.course?.title
                    ?.toLowerCase()
                    .includes(search.toLowerCase())

            );

        }

        // Student Filter

        if (studentFilter !== "") {

            filtered = filtered.filter(

                attendance =>

                    attendance.student?.id === Number(studentFilter)

            );

        }

        // Course Filter

        if (courseFilter !== "") {

            filtered = filtered.filter(

                attendance =>

                    attendance.course?.id === Number(courseFilter)

            );

        }

        // Status Filter

        if (statusFilter !== "") {

            filtered = filtered.filter(

                attendance =>

                    attendance.status === statusFilter

            );

        }

        // Date Filter

        if (dateFilter !== "") {

            filtered = filtered.filter(

                attendance =>

                    attendance.attendanceDate === dateFilter

            );

        }

        // Sort

        filtered.sort((a, b) => {

            if (sortOrder === "ASC") {

                return new Date(a.attendanceDate) - new Date(b.attendanceDate);

            }

            return new Date(b.attendanceDate) - new Date(a.attendanceDate);

        });

        setFilteredAttendance(filtered);

    };

    const resetFilters = () => {

        setSearch("");
        setStudentFilter("");
        setCourseFilter("");
        setStatusFilter("");
        setDateFilter("");
        setSortOrder("DESC");

    };

    const deleteAttendance = (id) => {

        if (!window.confirm("Delete this attendance record?")) {
            return;
        }

        AttendanceService.deleteAttendance(id)
            .then(() => {

                loadAttendance();

            })
            .catch(console.error);

    };

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h2>Attendance Management</h2>

                    <Link
                        to="/attendance/add"
                        className="btn btn-primary"
                    >
                        Mark Attendance
                    </Link>

                </div>

                <div className="card shadow">

                    <div className="card-body">

                        {/* Search */}

                        <div className="row mb-3">

                            <div className="col-md-4">

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search Student or Course..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />

                            </div>

                            <div className="col-md-2">

                                <select
                                    className="form-select"
                                    value={studentFilter}
                                    onChange={(e) =>
                                        setStudentFilter(e.target.value)
                                    }
                                >

                                    <option value="">All Students</option>

                                    {[...new Map(
                                        attendanceList.map(a => [
                                            a.student.id,
                                            a.student
                                        ])
                                    ).values()].map(student => (

                                        <option
                                            key={student.id}
                                            value={student.id}
                                        >
                                            {student.fullName}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div className="col-md-2">

                                <select
                                    className="form-select"
                                    value={courseFilter}
                                    onChange={(e) =>
                                        setCourseFilter(e.target.value)
                                    }
                                >

                                    <option value="">All Courses</option>

                                    {[...new Map(
                                        attendanceList.map(a => [
                                            a.course.id,
                                            a.course
                                        ])
                                    ).values()].map(course => (

                                        <option
                                            key={course.id}
                                            value={course.id}
                                        >
                                            {course.title}
                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div className="col-md-2">

                                <select
                                    className="form-select"
                                    value={statusFilter}
                                    onChange={(e) =>
                                        setStatusFilter(e.target.value)
                                    }
                                >

                                    <option value="">All Status</option>

                                    <option value="PRESENT">
                                        PRESENT
                                    </option>

                                    <option value="ABSENT">
                                        ABSENT
                                    </option>

                                    <option value="LATE">
                                        LATE
                                    </option>

                                </select>

                            </div>

                            <div className="col-md-2">

                                <input
                                    type="date"
                                    className="form-control"
                                    value={dateFilter}
                                    onChange={(e) =>
                                        setDateFilter(e.target.value)
                                    }
                                />

                            </div>

                        </div>

                        {/* Sort */}

                        <div className="row mb-3">

                            <div className="col-md-3">

                                <select
                                    className="form-select"
                                    value={sortOrder}
                                    onChange={(e) =>
                                        setSortOrder(e.target.value)
                                    }
                                >

                                    <option value="DESC">
                                        Newest First
                                    </option>

                                    <option value="ASC">
                                        Oldest First
                                    </option>

                                </select>

                            </div>

                            <div className="col-md-2">

                                <button
                                    className="btn btn-secondary w-100"
                                    onClick={resetFilters}
                                >
                                    Reset
                                </button>

                            </div>

                            <div className="col-md-7 text-end">

                                <span className="badge bg-primary fs-6">

                                    Total Records : {filteredAttendance.length}

                                </span>

                            </div>

                        </div>

                        <table className="table table-bordered table-hover">

                            <thead className="table-dark">

                                <tr>

                                    <th>ID</th>
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Remarks</th>
                                    <th width="180">
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredAttendance.length > 0 ? (

                                    filteredAttendance.map((attendance) => (

                                        <tr key={attendance.id}>

                                            <td>{attendance.id}</td>

                                            <td>{attendance.student?.fullName}</td>

                                            <td>{attendance.course?.title}</td>

                                            <td>{attendance.attendanceDate}</td>

                                            <td>

                                                <span
                                                    className={`badge ${
                                                        attendance.status === "PRESENT"
                                                            ? "bg-success"
                                                            : attendance.status === "ABSENT"
                                                            ? "bg-danger"
                                                            : attendance.status === "LATE"
                                                            ? "bg-warning text-dark"
                                                            : "bg-secondary"
                                                    }`}
                                                >
                                                    {attendance.status}
                                                </span>

                                            </td>

                                            <td>

                                                {attendance.remarks || "-"}

                                            </td>

                                            <td>

                                                <Link
                                                    to={`/attendance/edit/${attendance.id}`}
                                                    className="btn btn-warning btn-sm me-2"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        deleteAttendance(attendance.id)
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="text-center"
                                        >
                                            No attendance records found.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default AttendanceList;