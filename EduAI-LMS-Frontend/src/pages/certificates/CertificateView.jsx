import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import CertificateService from "../../services/CertificateService";

function CertificateView() {

    const { id } = useParams();

    const [certificate, setCertificate] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {

        loadCertificate();

    }, [id]);

    const loadCertificate = async () => {

        try {

            setLoading(true);

            const response =
                await CertificateService
                    .getCertificate(id);

            setCertificate(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to load certificate:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Failed to load certificate."
            );

        } finally {

            setLoading(false);
        }
    };

    const printCertificate = () => {

        window.print();

    };

    if (loading) {

        return (

            <DashboardLayout>

                <div className="container mt-5 text-center">

                    <div
                        className="spinner-border"
                        role="status"
                    />

                    <h4 className="mt-3">
                        Loading Certificate...
                    </h4>

                </div>

            </DashboardLayout>
        );
    }

    if (error) {

        return (

            <DashboardLayout>

                <div className="container mt-5">

                    <div className="alert alert-danger">
                        {error}
                    </div>

                    <Link
                        to="/certificates"
                        className="btn btn-primary"
                    >
                        Back to Certificates
                    </Link>

                </div>

            </DashboardLayout>
        );
    }

    if (!certificate) {

        return (

            <DashboardLayout>

                <div className="container mt-5">

                    <div className="alert alert-warning">
                        Certificate not found.
                    </div>

                </div>

            </DashboardLayout>
        );
    }

    const issuedDate =
        certificate.issuedAt
            ? new Date(
                certificate.issuedAt
            ).toLocaleDateString()
            : "N/A";

    return (

        <DashboardLayout>

            <div className="container mt-4">

                {/* PRINT AREA */}

                <div
                    id="certificate-print"
                    className="card shadow-lg border-3"
                    style={{
                        borderColor: "#0d6efd"
                    }}
                >

                    <div className="card-body text-center p-5">

                        <h1 className="display-4 text-primary">
                            Certificate of Completion
                        </h1>

                        <hr />

                        <p className="fs-4">
                            This certifies that
                        </p>

                        <h2 className="fw-bold">
                            {
                                certificate
                                    .student
                                    ?.fullName ||
                                "Student"
                            }
                        </h2>

                        <p className="fs-5 mt-4">
                            has successfully completed the course
                        </p>

                        <h3 className="text-success">
                            {
                                certificate
                                    .course
                                    ?.title ||
                                "Course"
                            }
                        </h3>

                        <div className="mt-4">

                            <p>
                                <strong>
                                    Certificate Number:
                                </strong>

                                <br />

                                {
                                    certificate
                                        .certificateNumber
                                }
                            </p>

                            <p>
                                <strong>
                                    Issued Date:
                                </strong>

                                <br />

                                {issuedDate}
                            </p>

                        </div>

                        {/* ORIGINAL UPLOADED FILE */}

                        <div className="mt-4">

                            <h5>
                                Uploaded Certificate
                            </h5>

                            {certificate.fileUrl && (

                                <a
                                    href={
                                        certificate.fileUrl
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-success me-2"
                                >
                                    📄 View Uploaded File
                                </a>

                            )}

                            <button
                                className="btn btn-primary"
                                onClick={
                                    printCertificate
                                }
                            >
                                🖨 Print
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default CertificateView;