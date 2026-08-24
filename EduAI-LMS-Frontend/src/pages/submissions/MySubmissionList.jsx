import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import AssignmentSubmissionService
    from "../../services/AssignmentSubmissionService";


function MySubmissionList() {

    // =====================================================
    // STATE
    // =====================================================

    const [submissions, setSubmissions] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [studentId, setStudentId] = useState(null);


    // =====================================================
    // GET LOGGED-IN STUDENT ID
    // =====================================================

    const getStudentId = () => {

        try {

            const storedUser =
                localStorage.getItem("user");


            if (storedUser) {

                const user =
                    JSON.parse(storedUser);

                console.log(
                    "Logged-in user:",
                    user
                );


                /*
                 * Try the possible ID fields.
                 */

                return (
                    user?.studentId ??
                    user?.id ??
                    user?.userId ??
                    null
                );

            }


            /*
             * Some projects store studentId separately.
             */

            const storedStudentId =
                localStorage.getItem("studentId");


            if (storedStudentId) {

                return Number(
                    storedStudentId
                );

            }


        } catch (error) {

            console.error(
                "Unable to read student information:",
                error
            );

        }


        return null;

    };


    // =====================================================
    // LOAD MY SUBMISSIONS
    // =====================================================

    const loadMySubmissions = async (id) => {

        if (!id) {

            console.error(
                "Student ID not found."
            );

            setSubmissions([]);

            setLoading(false);

            return;

        }


        try {

            setLoading(true);


            console.log(
                "================================"
            );

            console.log(
                "LOADING STUDENT SUBMISSIONS"
            );

            console.log(
                "Student ID:",
                id
            );

            console.log(
                "================================"
            );


            /*
             * IMPORTANT:
             *
             * The service function is
             * getStudentSubmissions()
             *
             * NOT getByStudent()
             */

            const response =
                await AssignmentSubmissionService
                    .getStudentSubmissions(id);


            console.log(
                "STUDENT SUBMISSION RESPONSE:",
                response
            );


            console.log(
                "STUDENT SUBMISSION DATA:",
                response.data
            );


            /*
             * Backend returns List<Submission>
             */

            let data = [];


            if (Array.isArray(response.data)) {

                data = response.data;

            } else if (
                Array.isArray(
                    response.data?.content
                )
            ) {

                data =
                    response.data.content;

            }


            console.log(
                "MY SUBMISSIONS:",
                data
            );


            setSubmissions(data);


        } catch (error) {

            console.error(
                "FAILED TO LOAD MY SUBMISSIONS"
            );


            console.error(
                "ERROR:",
                error
            );


            console.error(
                "STATUS:",
                error?.response?.status
            );


            console.error(
                "BACKEND RESPONSE:",
                error?.response?.data
            );


            setSubmissions([]);

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        const id =
            getStudentId();


        console.log(
            "Detected student ID:",
            id
        );


        setStudentId(id);


        if (id) {

            loadMySubmissions(id);

        } else {

            setLoading(false);

        }

    }, []);


    // =====================================================
    // SEARCH
    // =====================================================

    const filteredSubmissions =
        submissions.filter(
            (submission) => {

                const assignmentTitle =
                    submission?.assignment?.title ||
                    submission?.assignmentTitle ||
                    "";


                return assignmentTitle
                    .toString()
                    .toLowerCase()
                    .includes(
                        search
                            .toLowerCase()
                            .trim()
                    );

            }
        );


    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (date) => {

        if (!date) {

            return "-";

        }


        try {

            return new Date(date)
                .toLocaleString();

        } catch {

            return date;

        }

    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card shadow">


                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="card-header">

                        <h2 className="mb-0">

                            My Assignment Submissions

                        </h2>

                    </div>


                    {/* =================================================
                        BODY
                    ================================================= */}

                    <div className="card-body">


                        {/* =================================================
                            INFO
                        ================================================= */}

                        <div className="alert alert-info">

                            Showing your submitted assignments only.

                        </div>


                        {/* =================================================
                            STUDENT ID ERROR
                        ================================================= */}

                        {!studentId && (

                            <div className="alert alert-danger">

                                Student information was not found.
                                Please logout and login again.

                            </div>

                        )}


                        {/* =================================================
                            SEARCH
                        ================================================= */}

                        <div className="mb-3">

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search Assignment..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* =================================================
                            COUNT
                        ================================================= */}

                        <div className="mb-3">

                            <span className="badge bg-primary fs-6">

                                My Submissions :{" "}
                                {filteredSubmissions.length}

                            </span>

                        </div>


                        {/* =================================================
                            LOADING
                        ================================================= */}

                        {loading ? (

                            <div className="text-center py-4">

                                <div
                                    className="spinner-border"
                                    role="status"
                                />

                                <p className="mt-3">

                                    Loading submissions...

                                </p>

                            </div>

                        ) : (

                            /* =================================================
                               TABLE
                            ================================================= */

                            <div className="table-responsive">

                                <table className="table table-bordered table-hover">


                                    <thead className="table-dark">

                                        <tr>

                                            <th>
                                                Assignment
                                            </th>

                                            <th>
                                                Submitted At
                                            </th>

                                            <th>
                                                File
                                            </th>

                                            <th>
                                                Score
                                            </th>

                                            <th>
                                                Feedback
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>


                                        {/* =================================================
                                            NO SUBMISSIONS
                                        ================================================= */}

                                        {filteredSubmissions.length === 0 ? (

                                            <tr>

                                                <td
                                                    colSpan="5"
                                                    className="text-center"
                                                >

                                                    You have not submitted
                                                    any assignments yet.

                                                </td>

                                            </tr>

                                        ) : (


                                            /* =================================================
                                               SUBMISSIONS
                                            ================================================= */

                                            filteredSubmissions.map(
                                                (submission) => {

                                                    const assignmentTitle =
                                                        submission?.assignment?.title ||
                                                        submission?.assignmentTitle ||
                                                        "Assignment";


                                                    const fileUrl =
                                                        submission?.fileUrl ||
                                                        submission?.fileURL ||
                                                        submission?.file ||
                                                        "";


                                                    return (

                                                        <tr
                                                            key={
                                                                submission.id
                                                            }
                                                        >


                                                            {/* =================================
                                                                ASSIGNMENT
                                                            ================================= */}

                                                            <td>

                                                                <strong>

                                                                    {
                                                                        assignmentTitle
                                                                    }

                                                                </strong>

                                                            </td>


                                                            {/* =================================
                                                                SUBMITTED AT
                                                            ================================= */}

                                                            <td>

                                                                {
                                                                    formatDate(
                                                                        submission.submittedAt
                                                                    )
                                                                }

                                                            </td>


                                                            {/* =================================
                                                                FILE
                                                            ================================= */}

                                                            <td>

                                                                {fileUrl ? (

                                                                    <a
                                                                        href={
                                                                            fileUrl
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="btn btn-info btn-sm"
                                                                    >

                                                                        View File

                                                                    </a>

                                                                ) : (

                                                                    <span className="text-muted">

                                                                        No file

                                                                    </span>

                                                                )}

                                                            </td>


                                                            {/* =================================
                                                                SCORE
                                                            ================================= */}

                                                            <td>

                                                                {
                                                                    submission.marks !== null &&
                                                                    submission.marks !== undefined
                                                                        ? submission.marks
                                                                        : "-"
                                                                }

                                                            </td>


                                                            {/* =================================
                                                                FEEDBACK
                                                            ================================= */}

                                                            <td>

                                                                {
                                                                    submission.feedback ||
                                                                    "-"
                                                                }

                                                            </td>


                                                        </tr>

                                                    );

                                                }

                                            )

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}


                        {/* =================================================
                            REFRESH
                        ================================================= */}

                        <button
                            className="btn btn-outline-primary mt-3"
                            onClick={() =>
                                loadMySubmissions(studentId)
                            }
                            disabled={!studentId || loading}
                        >

                            Refresh Submissions

                        </button>


                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}


export default MySubmissionList;