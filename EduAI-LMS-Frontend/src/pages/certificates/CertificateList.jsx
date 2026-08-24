import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import CertificateService from "../../services/CertificateService";

function CertificateList() {

    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [user, setUser] = useState(null);

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem("user");

            console.log("STORED USER:", storedUser);

            if (!storedUser) {

                setError(
                    "Logged-in user information not found."
                );

                setLoading(false);

                return;
            }

            const loggedUser =
                JSON.parse(storedUser);

            console.log(
                "LOGGED USER:",
                loggedUser
            );

            setUser(loggedUser);

        } catch (err) {

            console.error(
                "Failed to read user:",
                err
            );

            setError(
                "Unable to read logged-in user."
            );

            setLoading(false);
        }

    }, []);

    // =====================================================
    // LOAD CERTIFICATES
    // =====================================================

    useEffect(() => {

        if (!user) {
            return;
        }

        loadCertificates();

    }, [user]);

    const loadCertificates = async () => {

        try {

            setLoading(true);
            setError("");

            const role =
                user.role ||
                user.userRole;

            const studentId =
                user.id ||
                user.userId ||
                user.studentId;

            console.log(
                "CERTIFICATE USER ROLE:",
                role
            );

            console.log(
                "CERTIFICATE STUDENT ID:",
                studentId
            );

            // =================================================
            // STUDENT
            // =================================================

            if (role === "STUDENT") {

                if (!studentId) {

                    setError(
                        "Student ID was not found."
                    );

                    return;
                }

                console.log(
                    "Loading student certificates..."
                );

                const response =
                    await CertificateService
                        .getStudentCertificates(studentId);

                console.log(
                    "STUDENT CERTIFICATES:",
                    response.data
                );

                setCertificates(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

                return;
            }

            // =================================================
            // ADMIN / TEACHER
            // =================================================

            if (
                role === "ADMIN" ||
                role === "TEACHER"
            ) {

                console.log(
                    "Loading all certificates..."
                );

                const response =
                    await CertificateService
                        .getAllCertificates();

                console.log(
                    "ALL CERTIFICATES:",
                    response.data
                );

                setCertificates(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

                return;
            }

            setError(
                "You are not authorized to view certificates."
            );

        } catch (err) {

            console.error(
                "CERTIFICATE LOAD ERROR:",
                err
            );

            console.error(
                "BACKEND RESPONSE:",
                err.response?.data
            );

            console.error(
                "STATUS:",
                err.response?.status
            );

            setError(
                err.response?.data?.message ||
                "Failed to load certificates."
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // DELETE
    // =====================================================

    const deleteCertificate = async (id) => {

        if (
            !window.confirm(
                "Delete this certificate?"
            )
        ) {
            return;
        }

        try {

            await CertificateService
                .deleteCertificate(id);

            await loadCertificates();

        } catch (err) {

            console.error(
                "DELETE CERTIFICATE ERROR:",
                err
            );

            alert(
                err.response?.data?.message ||
                "Failed to delete certificate."
            );
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (

            <DashboardLayout>

                <div className="container mt-5 text-center">

                    <h3>
                        Loading Certificates...
                    </h3>

                </div>

            </DashboardLayout>
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    const role =
        user?.role ||
        user?.userRole;

    const isAdmin =
        role === "ADMIN";

    const isTeacher =
        role === "TEACHER";

    const isStudent =
        role === "STUDENT";

    return (

        <DashboardLayout>

            <div className="container mt-4">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h2>
                        {isStudent
                            ? "My Certificates"
                            : "Certificates"}
                    </h2>

                    {/* ONLY ADMIN / TEACHER CAN UPLOAD */}

                    {(isAdmin || isTeacher) && (

                        <Link
                            to="/certificates/upload"
                            className="btn btn-primary"
                        >
                            + Upload Certificate
                        </Link>

                    )}

                </div>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="alert alert-danger">

                        {error}

                    </div>

                )}

                {/* =================================================
                    NO CERTIFICATES
                ================================================= */}

                {!error &&
                    certificates.length === 0 && (

                        <div className="alert alert-info">

                            {isStudent
                                ? "No certificates found for your account."
                                : "No certificates found."}

                        </div>

                    )}

                {/* =================================================
                    STUDENT CARD VIEW
                ================================================= */}

                {isStudent &&
                    certificates.length > 0 && (

                        <div className="row">

                            {certificates.map(
                                (certificate) => (

                                    <div
                                        className="col-md-6 col-lg-4 mb-4"
                                        key={certificate.id}
                                    >

                                        <div className="card shadow h-100">

                                            <div className="card-body">

                                                <h4 className="text-primary">
                                                    Certificate of Completion
                                                </h4>

                                                <hr />

                                                <p>
                                                    <strong>
                                                        Course:
                                                    </strong>
                                                    <br />

                                                    {certificate.course?.title ||
                                                        "Course"}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Certificate Number:
                                                    </strong>
                                                    <br />

                                                    {certificate.certificateNumber}
                                                </p>

                                                <p>
                                                    <strong>
                                                        Issued Date:
                                                    </strong>
                                                    <br />

                                                    {certificate.issuedDate ||
                                                        certificate.issuedAt ||
                                                        "N/A"}
                                                </p>

                                                <div className="mt-3">

                                                    <Link
                                                        to={`/certificates/view/${certificate.id}`}
                                                        className="btn btn-primary me-2"
                                                    >
                                                        View Certificate
                                                    </Link>

                                                    {certificate.fileUrl && (

                                                        <a
                                                            href={certificate.fileUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="btn btn-success"
                                                        >
                                                            Open File
                                                        </a>

                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                {/* =================================================
                    ADMIN / TEACHER TABLE
                ================================================= */}

                {(isAdmin || isTeacher) &&
                    certificates.length > 0 && (

                        <div className="table-responsive">

                            <table className="table table-bordered table-striped">

                                <thead className="table-dark">

                                    <tr>

                                        <th>
                                            ID
                                        </th>

                                        <th>
                                            Student
                                        </th>

                                        <th>
                                            Course
                                        </th>

                                        <th>
                                            Certificate Number
                                        </th>

                                        <th>
                                            Issued Date
                                        </th>

                                        <th>
                                            Actions
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {certificates.map(
                                        (certificate) => (

                                            <tr
                                                key={
                                                    certificate.id
                                                }
                                            >

                                                <td>
                                                    {
                                                        certificate.id
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        certificate
                                                            .student
                                                            ?.fullName
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        certificate
                                                            .course
                                                            ?.title
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        certificate
                                                            .certificateNumber
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        certificate
                                                            .issuedDate ||
                                                        certificate
                                                            .issuedAt ||
                                                        "N/A"
                                                    }
                                                </td>

                                                <td>

                                                    <Link
                                                        to={`/certificates/view/${certificate.id}`}
                                                        className="btn btn-primary btn-sm me-2"
                                                    >
                                                        View
                                                    </Link>

                                                    <button
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() =>
                                                            deleteCertificate(
                                                                certificate.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>

                    )}

            </div>

        </DashboardLayout>
    );
}

export default CertificateList;