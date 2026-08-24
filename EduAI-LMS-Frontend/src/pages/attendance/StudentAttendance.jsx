import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import AttendanceService from "../../services/AttendanceService";

function StudentAttendance() {

    const [attendanceList, setAttendanceList] = useState([]);
    const [attendancePercentage, setAttendancePercentage] = useState(0);

    useEffect(() => {

        loadAttendance();

    }, []);

    const loadAttendance = () => {

        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            return;
        }

        AttendanceService.getStudentAttendance(user.id)
            .then((response) => {

                const records = response.data;

                setAttendanceList(records);

                if (records.length > 0) {

                    const total = records.length;

                    const present = records.filter(
                        item => item.status === "PRESENT"
                    ).length;

                    setAttendancePercentage(
                        ((present / total) * 100).toFixed(2)
                    );
                }

            })
            .catch(console.error);

    };

    const badgeClass = (status) => {

        switch (status) {

            case "PRESENT":
                return "bg-success";

            case "ABSENT":
                return "bg-danger";

            case "LATE":
                return "bg-warning text-dark";

            case "EXCUSED":
                return "bg-info text-dark";

            default:
                return "bg-secondary";

        }

    };

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card shadow">

                    <div className="card-header d-flex justify-content-between align-items-center">

                        <h2>My Attendance</h2>

                        <span className="badge bg-primary fs-6">

                            Attendance: {attendancePercentage}%

                        </span>

                    </div>

                    <div className="card-body">

                        <table className="table table-bordered table-hover">

                            <thead className="table-dark">

                                <tr>

                                    <th>#</th>
                                    <th>Course</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Remarks</th>

                                </tr>

                            </thead>

                            <tbody>

                                {attendanceList.length > 0 ? (

                                    attendanceList.map((attendance, index) => (

                                        <tr key={attendance.id}>

                                            <td>{index + 1}</td>

                                            <td>

                                                {attendance.course?.title}

                                            </td>

                                            <td>

                                                {attendance.attendanceDate}

                                            </td>

                                            <td>

                                                <span
                                                    className={`badge ${badgeClass(attendance.status)}`}
                                                >

                                                    {attendance.status}

                                                </span>

                                            </td>

                                            <td>

                                                {attendance.remarks || "-"}

                                            </td>

                                        </tr>

                                    ))

                                ) : (

                                    <tr>

                                        <td
                                            colSpan="5"
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

export default StudentAttendance;