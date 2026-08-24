import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import CertificateService from "../../services/CertificateService";
import axiosInstance from "../../api/axiosConfig";
function CertificateUpload() {
    // =====================================================
    // STATE
    // =====================================================

    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [courseId, setCourseId] = useState("");

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    // =====================================================
    // LOAD STUDENTS + COURSES
    // =====================================================

    useEffect(() => {
        loadStudents();
        loadCourses();
    }, []);

    const loadStudents = async () => {
        try {
            const response = await axiosInstance.get("/users");

            console.log("STUDENTS RESPONSE:", response.data);

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.content || [];

            // Only show students
            const studentUsers = data.filter((user) => {
                const role =
                    user.role ||
                    user.userRole ||
                    user.roles?.[0];

                if (typeof role === "object") {
                    return (
                        role.name === "STUDENT" ||
                        role.authority === "ROLE_STUDENT"
                    );
                }

                return (
                    role === "STUDENT" ||
                    role === "ROLE_STUDENT"
                );
            });

            setStudents(studentUsers);

        } catch (error) {
            console.error("Failed to load students:", error);

            setErrorMessage(
                error.response?.data?.message ||
                "Failed to load students."
            );
        }
    };

    const loadCourses = async () => {
        try {
            const response = await axiosInstance.get("/courses");

            console.log("COURSES RESPONSE:", response.data);

            const data = Array.isArray(response.data)
                ? response.data
                : response.data.content || [];

            setCourses(data);

        } catch (error) {
            console.error("Failed to load courses:", error);

            setErrorMessage(
                error.response?.data?.message ||
                "Failed to load courses."
            );
        } finally {
            setLoadingData(false);
        }
    };

    // =====================================================
    // FILE CHANGE
    // =====================================================

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];

        setSuccessMessage("");
        setErrorMessage("");

        if (!selectedFile) {
            setFile(null);
            return;
        }

        console.log("SELECTED FILE:", selectedFile);

        // -------------------------------------------------
        // MAX SIZE = 10 MB
        // -------------------------------------------------

        const maxSize = 10 * 1024 * 1024;

        if (selectedFile.size > maxSize) {
            setErrorMessage(
                "Certificate file must be smaller than 10 MB."
            );

            event.target.value = "";
            setFile(null);

            return;
        }

        // -------------------------------------------------
        // ALLOWED TYPES
        // -------------------------------------------------

        const allowedTypes = [
            "application/pdf",
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(selectedFile.type)) {
            setErrorMessage(
                "Only PDF, JPG, PNG or WEBP certificate files are allowed."
            );

            event.target.value = "";
            setFile(null);

            return;
        }

        setFile(selectedFile);
    };

    // =====================================================
    // UPLOAD
    // =====================================================

    const handleUpload = async (event) => {
        event.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!studentId) {
            setErrorMessage("Please select a student.");
            return;
        }

        if (!courseId) {
            setErrorMessage("Please select a course.");
            return;
        }

        if (!file) {
            setErrorMessage("Please select a certificate file.");
            return;
        }

        // -------------------------------------------------
        // DEBUG
        // -------------------------------------------------

        console.log("==============================");
        console.log("CERTIFICATE UPLOAD");
        console.log("==============================");

        console.log("studentId:", studentId);
        console.log("courseId:", courseId);
        console.log("file:", file);

        // -------------------------------------------------
        // UPLOAD
        // -------------------------------------------------

        try {
            setLoading(true);

            const response =
                await CertificateService.uploadCertificate(
                    Number(studentId),
                    Number(courseId),
                    file
                );

            console.log(
                "CERTIFICATE UPLOAD RESPONSE:",
                response.data
            );

            setSuccessMessage(
                "Certificate uploaded successfully."
            );

            // Clear form
            setStudentId("");
            setCourseId("");
            setFile(null);

            // Reset file input
            const fileInput =
                document.getElementById("certificateFile");

            if (fileInput) {
                fileInput.value = "";
            }

        } catch (error) {

            console.error(
                "Certificate upload failed:",
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

            const backendMessage =
                error.response?.data?.message;

            setErrorMessage(
                backendMessage ||
                "Failed to upload certificate."
            );

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FORMAT FILE SIZE
    // =====================================================

    const formatFileSize = (bytes) => {
        if (!bytes) {
            return "0 MB";
        }

        return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <DashboardLayout>

            <div className="container mt-4 mb-5">

                <div
                    className="card shadow"
                    style={{
                        maxWidth: "700px",
                        margin: "0 auto"
                    }}
                >

                    {/* ================================================= */}
                    {/* HEADER */}
                    {/* ================================================= */}

                    <div className="card-header bg-primary text-white">

                        <h2 className="mb-0">
                            Upload Student Certificate
                        </h2>

                    </div>

                    {/* ================================================= */}
                    {/* BODY */}
                    {/* ================================================= */}

                    <div className="card-body">

                        {/* ================================================= */}
                        {/* SUCCESS */}
                        {/* ================================================= */}

                        {successMessage && (

                            <div
                                className="alert alert-success"
                                role="alert"
                            >
                                {successMessage}
                            </div>

                        )}

                        {/* ================================================= */}
                        {/* ERROR */}
                        {/* ================================================= */}

                        {errorMessage && (

                            <div
                                className="alert alert-danger"
                                role="alert"
                            >
                                {errorMessage}
                            </div>

                        )}

                        {loadingData ? (

                            <div className="text-center py-4">

                                <div
                                    className="spinner-border text-primary"
                                    role="status"
                                />

                                <p className="mt-2 mb-0">
                                    Loading students and courses...
                                </p>

                            </div>

                        ) : (

                            <form onSubmit={handleUpload}>

                                {/* ========================================= */}
                                {/* STUDENT */}
                                {/* ========================================= */}

                                <div className="mb-3">

                                    <label
                                        htmlFor="student"
                                        className="form-label fw-bold"
                                    >
                                        Student
                                    </label>

                                    <select
                                        id="student"
                                        className="form-select"
                                        value={studentId}
                                        onChange={(e) =>
                                            setStudentId(
                                                e.target.value
                                            )
                                        }
                                        disabled={loading}
                                    >

                                        <option value="">
                                            -- Select Student --
                                        </option>

                                        {students.map((student) => (

                                            <option
                                                key={student.id}
                                                value={student.id}
                                            >
                                                {student.fullName ||
                                                    student.name ||
                                                    student.email ||
                                                    `Student ${student.id}`}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                {/* ========================================= */}
                                {/* COURSE */}
                                {/* ========================================= */}

                                <div className="mb-3">

                                    <label
                                        htmlFor="course"
                                        className="form-label fw-bold"
                                    >
                                        Course
                                    </label>

                                    <select
                                        id="course"
                                        className="form-select"
                                        value={courseId}
                                        onChange={(e) =>
                                            setCourseId(
                                                e.target.value
                                            )
                                        }
                                        disabled={loading}
                                    >

                                        <option value="">
                                            -- Select Course --
                                        </option>

                                        {courses.map((course) => (

                                            <option
                                                key={course.id}
                                                value={course.id}
                                            >
                                                {course.title ||
                                                    course.name ||
                                                    `Course ${course.id}`}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                {/* ========================================= */}
                                {/* FILE */}
                                {/* ========================================= */}

                                <div className="mb-3">

                                    <label
                                        htmlFor="certificateFile"
                                        className="form-label fw-bold"
                                    >
                                        Certificate File
                                    </label>

                                    <input
                                        id="certificateFile"
                                        type="file"
                                        className="form-control"
                                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                                        onChange={handleFileChange}
                                        disabled={loading}
                                    />

                                    <div className="form-text">
                                        PDF, JPG, PNG or WEBP.
                                        Maximum 10 MB.
                                    </div>

                                </div>

                                {/* ========================================= */}
                                {/* FILE PREVIEW */}
                                {/* ========================================= */}

                                {file && (

                                    <div className="alert alert-info">

                                        <strong>
                                            Selected file:
                                        </strong>

                                        <br />

                                        {file.name}

                                        <br />

                                        {formatFileSize(file.size)}

                                    </div>

                                )}

                                {/* ========================================= */}
                                {/* DEBUG INFORMATION */}
                                {/* ========================================= */}

                                {studentId && courseId && file && (

                                    <div className="small text-muted mb-3">

                                        <div>
                                            Student ID: {studentId}
                                        </div>

                                        <div>
                                            Course ID: {courseId}
                                        </div>

                                        <div>
                                            File: {file.name}
                                        </div>

                                    </div>

                                )}

                                {/* ========================================= */}
                                {/* SUBMIT */}
                                {/* ========================================= */}

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={loading}
                                >

                                    {loading ? (

                                        <>
                                            <span
                                                className="spinner-border spinner-border-sm me-2"
                                                role="status"
                                            />

                                            Uploading...
                                        </>

                                    ) : (

                                        <>
                                            📄 Upload Certificate
                                        </>

                                    )}

                                </button>

                            </form>

                        )}

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default CertificateUpload;