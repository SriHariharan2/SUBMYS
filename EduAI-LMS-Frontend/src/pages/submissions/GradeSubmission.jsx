import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import AssignmentSubmissionService from "../../services/AssignmentSubmissionService";

function GradeSubmission() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [submission, setSubmission] = useState(null);

    const [score, setScore] = useState("");

    const [feedback, setFeedback] = useState("");

    useEffect(() => {

        AssignmentSubmissionService.getById(id)
            .then((res) => {

                setSubmission(res.data);

                if (res.data.score != null)
                    setScore(res.data.score);

                if (res.data.feedback)
                    setFeedback(res.data.feedback);

            })
            .catch(console.error);

    }, [id]);

    const saveGrade = (e) => {

        e.preventDefault();

        AssignmentSubmissionService.grade(
            id,
            score,
            feedback
        )
            .then(() => {

                alert("Grade Saved Successfully");

                navigate("/submissions");

            })
            .catch((error) => {

                console.error(error);

                alert("Unable to Save Grade");

            });

    };

    if (!submission) {

        return (

            <DashboardLayout>

                <div className="container mt-5">

                    Loading...

                </div>

            </DashboardLayout>

        );

    }

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h3>Grade Assignment</h3>

                    </div>

                    <div className="card-body">

                        <form onSubmit={saveGrade}>

                            <div className="mb-3">

                                <label className="form-label">

                                    Student

                                </label>

                                <input
                                    className="form-control"
                                    value={submission.studentName}
                                    readOnly
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Assignment

                                </label>

                                <input
                                    className="form-control"
                                    value={submission.assignmentTitle}
                                    readOnly
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Maximum Marks

                                </label>

                                <input
                                    className="form-control"
                                    value={submission.maxMarks}
                                    readOnly
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Submitted File

                                </label>

                                <br />

                                <a
                                    href={submission.fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-info"
                                >
                                    Open Submission
                                </a>

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Score

                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={score}
                                    onChange={(e) => setScore(e.target.value)}
                                    required
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Feedback

                                </label>

                                <textarea
                                    rows="4"
                                    className="form-control"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                />

                            </div>

                            <button
                                className="btn btn-success"
                                type="submit"
                            >

                                Save Grade

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default GradeSubmission;