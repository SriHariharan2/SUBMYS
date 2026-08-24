import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import AttendanceService from "../../services/AttendanceService";
import UserService from "../../services/UserService";
import CourseService from "../../services/CourseService";


function AttendanceForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");

    const [attendance, setAttendance] = useState({
        studentId: "",
        courseId: "",
        attendanceDate: "",
        status: "PRESENT",
        remarks: ""
    });


    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {

        loadData();

        if (id) {
            loadAttendance();
        } else {

            // Automatically set today's date
            const today = new Date()
                .toISOString()
                .split("T")[0];

            setAttendance(prev => ({
                ...prev,
                attendanceDate: today
            }));
        }

    }, [id]);


    // =====================================================
    // LOAD STUDENTS + COURSES
    // =====================================================

    const loadData = async () => {

        setLoadingData(true);
        setErrorMessage("");

        try {

            const [studentsResponse, coursesResponse] =
                await Promise.all([

                    UserService.getUsersByRole("STUDENT"),

                    CourseService.getAllCourses()

                ]);


            console.log(
                "STUDENTS:",
                studentsResponse.data
            );

            console.log(
                "COURSES:",
                coursesResponse.data
            );


            setStudents(
                studentsResponse.data || []
            );

            setCourses(
                coursesResponse.data || []
            );


        } catch (error) {

            console.error(
                "LOAD ATTENDANCE DATA ERROR:",
                error
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "BACKEND RESPONSE:",
                error.response?.data
            );

            setErrorMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to load students or courses."
            );

        } finally {

            setLoadingData(false);

        }
    };


    // =====================================================
    // LOAD ATTENDANCE FOR EDIT
    // =====================================================

    const loadAttendance = async () => {

        try {

            const response =
                await AttendanceService.getAttendance(id);

            console.log(
                "ATTENDANCE RECORD:",
                response.data
            );

            const a = response.data;

            setAttendance({

                studentId:
                    a.student?.id ??
                    a.studentId ??
                    "",

                courseId:
                    a.course?.id ??
                    a.courseId ??
                    "",

                attendanceDate:
                    a.attendanceDate || "",

                status:
                    a.status || "PRESENT",

                remarks:
                    a.remarks || ""

            });

        } catch (error) {

            console.error(
                "LOAD ATTENDANCE ERROR:",
                error
            );

            setErrorMessage(
                error.response?.data?.message ||
                error.response?.data ||
                "Unable to load attendance."
            );

        }
    };


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setAttendance(prev => ({
            ...prev,
            [name]: value
        }));

        setErrorMessage("");
    };


    // =====================================================
    // HANDLE SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setErrorMessage("");

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!attendance.studentId) {

            setErrorMessage(
                "Please select a student."
            );

            return;
        }


        if (!attendance.courseId) {

            setErrorMessage(
                "Please select a course."
            );

            return;
        }


        if (!attendance.attendanceDate) {

            setErrorMessage(
                "Please select an attendance date."
            );

            return;
        }


        if (!attendance.status) {

            setErrorMessage(
                "Please select attendance status."
            );

            return;
        }


        // -------------------------------------------------
        // PAYLOAD
        // -------------------------------------------------

        const payload = {

            attendanceDate:
                attendance.attendanceDate,

            status:
                attendance.status,

            remarks:
                attendance.remarks?.trim() || ""

        };


        console.log(
            "===================================="
        );

        console.log(
            "ATTENDANCE SUBMIT"
        );

        console.log(
            "===================================="
        );

        console.log(
            "Student ID:",
            attendance.studentId
        );

        console.log(
            "Course ID:",
            attendance.courseId
        );

        console.log(
            "Payload:",
            payload
        );


        setLoading(true);


        try {

            let response;


            // =================================================
            // UPDATE
            // =================================================

            if (id) {

                response =
                    await AttendanceService.updateAttendance(
                        id,
                        payload
                    );

                console.log(
                    "ATTENDANCE UPDATED:",
                    response.data
                );

                alert(
                    "Attendance updated successfully!"
                );

            }

            // =================================================
            // CREATE
            // =================================================

            else {

                response =
                    await AttendanceService.markAttendance(
                        Number(attendance.studentId),
                        Number(attendance.courseId),
                        payload
                    );

                console.log(
                    "ATTENDANCE CREATED:",
                    response.data
                );

                alert(
                    "Attendance saved successfully!"
                );
            }


            // =================================================
            // GO TO ATTENDANCE LIST
            // =================================================

            navigate("/attendance");


        } catch (error) {

            console.error(
                "===================================="
            );

            console.error(
                "SAVE ATTENDANCE ERROR"
            );

            console.error(
                "===================================="
            );

            console.error(
                "STATUS:",
                error.response?.status
            );

            console.error(
                "DATA:",
                error.response?.data
            );

            console.error(
                "MESSAGE:",
                error.message
            );

            console.error(
                "FULL ERROR:",
                error
            );


            // -------------------------------------------------
            // SHOW ACTUAL BACKEND ERROR
            // -------------------------------------------------

            let message =
                "Unable to save attendance.";


            if (
                error.response?.data?.message
            ) {

                message =
                    error.response.data.message;

            } else if (
                typeof error.response?.data ===
                "string"
            ) {

                message =
                    error.response.data;

            } else if (
                error.message
            ) {

                message =
                    error.message;
            }


            setErrorMessage(message);

        } finally {

            setLoading(false);

        }
    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h3 className="mb-0">

                            {id
                                ? "Edit Attendance"
                                : "Mark Attendance"}

                        </h3>

                    </div>


                    <div className="card-body">


                        {/* ERROR */}

                        {errorMessage && (

                            <div
                                className="alert alert-danger"
                                role="alert"
                            >

                                <strong>
                                    Error:
                                </strong>{" "}

                                {errorMessage}

                            </div>

                        )}


                        {/* LOADING DATA */}

                        {loadingData ? (

                            <div className="alert alert-info">

                                Loading students and courses...

                            </div>

                        ) : (

                            <form
                                onSubmit={handleSubmit}
                            >


                                {/* =========================
                                    STUDENT
                                ========================= */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Student

                                    </label>


                                    <select
                                        className="form-select"
                                        name="studentId"
                                        value={
                                            attendance.studentId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={!!id}
                                        required
                                    >

                                        <option value="">

                                            Select Student

                                        </option>


                                        {students.map(
                                            student => (

                                                <option
                                                    key={
                                                        student.id
                                                    }
                                                    value={
                                                        student.id
                                                    }
                                                >

                                                    {
                                                        student.fullName
                                                    }

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* =========================
                                    COURSE
                                ========================= */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Course

                                    </label>


                                    <select
                                        className="form-select"
                                        name="courseId"
                                        value={
                                            attendance.courseId
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={!!id}
                                        required
                                    >

                                        <option value="">

                                            Select Course

                                        </option>


                                        {courses.map(
                                            course => (

                                                <option
                                                    key={
                                                        course.id
                                                    }
                                                    value={
                                                        course.id
                                                    }
                                                >

                                                    {
                                                        course.title
                                                    }

                                                </option>

                                            )
                                        )}

                                    </select>

                                </div>


                                {/* =========================
                                    DATE
                                ========================= */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Attendance Date

                                    </label>


                                    <input
                                        type="date"
                                        className="form-control"
                                        name="attendanceDate"
                                        value={
                                            attendance.attendanceDate
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    />

                                </div>


                                {/* =========================
                                    STATUS
                                ========================= */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Status

                                    </label>


                                    <select
                                        className="form-select"
                                        name="status"
                                        value={
                                            attendance.status
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        required
                                    >

                                        <option value="PRESENT">

                                            Present

                                        </option>


                                        <option value="ABSENT">

                                            Absent

                                        </option>


                                        <option value="LATE">

                                            Late

                                        </option>


                                        <option value="EXCUSED">

                                            Excused

                                        </option>

                                    </select>

                                </div>


                                {/* =========================
                                    REMARKS
                                ========================= */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Remarks

                                    </label>


                                    <textarea
                                        className="form-control"
                                        rows="3"
                                        name="remarks"
                                        value={
                                            attendance.remarks
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Optional remarks"
                                    />

                                </div>


                                {/* =========================
                                    BUTTONS
                                ========================= */}

                                <button
                                    type="submit"
                                    className="btn btn-primary me-2"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Saving..."
                                        : id
                                            ? "Update Attendance"
                                            : "Save Attendance"}

                                </button>


                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    disabled={loading}
                                    onClick={() =>
                                        navigate(
                                            "/attendance"
                                        )
                                    }
                                >

                                    Cancel

                                </button>


                            </form>

                        )}

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );
}


export default AttendanceForm;