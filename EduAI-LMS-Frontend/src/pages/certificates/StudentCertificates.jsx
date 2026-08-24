import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import CertificateService from "../../services/CertificateService";

function StudentCertificates() {

    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [studentId, setStudentId] = useState(null);

    // =====================================================
    // GET LOGGED-IN USER
    // =====================================================

    useEffect(() => {

        try {

            /*
             * Change this key ONLY if your project stores
             * the logged-in user under another localStorage key.
             */

            const storedUser =
                localStorage.getItem("user");

            if (!storedUser) {

                setError(
                    "Logged-in student information not found."
                );

                setLoading(false);

                return;
            }

            const user = JSON.parse(storedUser);

            console.log("Logged User:", user);

            const id =
                user.id ||
                user.userId ||
                user.studentId;

            if (!id) {

                setError(
                    "Student ID not found for logged-in user."
                );

                setLoading(false);

                return;
            }

            setStudentId(id);

        } catch (err) {

            console.error(
                "Failed to read logged-in user:",
                err
            );

            setError(
                "Unable to get logged-in student information."
            );

            setLoading(false);
        }

    }, []);

    // =====================================================
    // LOAD STUDENT CERTIFICATES
    // =====================================================

    useEffect(() => {

        if (!studentId) {
            return;
        }

        loadCertificates();

    }, [studentId]);

    const loadCertificates = () => {

        setLoading(true);
        setError("");

        console.log(
            "Loading certificates for student:",
            studentId
        );

        CertificateService
            .getStudentCertificates(studentId)
            .then((response) => {

                console.log(
                    "Student Certificates:",
                    response.data
                );

                setCertificates(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            })
            .catch((error) => {

                console.error(
                    "Failed to load certificates:",
                    error
                );

                console.error(
                    "Backend response:",
                    error.response?.data
                );

                setError(
                    error.response?.data?.message ||
                    "Failed to load certificates."
                );

            })
            .finally(() => {

                setLoading(false);

            });
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

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h2>
                        My Certificates
                    </h2>

                </div>

                {/* ERROR */}

                {error && (

                    <div className="alert alert-danger">

                        {error}

                    </div>

                )}

                {/* NO CERTIFICATES */}

                {!error && certificates.length === 0 && (

                    <div className="alert alert-info">

                        No certificates found.

                    </div>

                )}

                {/* CERTIFICATES */}

                {certificates.length > 0 && (

                    <div className="row">

                        {certificates.map((certificate) => (

                            <div
                                className="col-md-6 col-lg-4 mb-4"
                                key={certificate.id}
                            >

                                <div className="card shadow h-100">

                                    <div className="card-body">

                                        <h4 className="card-title text-primary">

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

                        ))}

                    </div>

                )}

            </div>

        </DashboardLayout>
    );
}

export default StudentCertificates;