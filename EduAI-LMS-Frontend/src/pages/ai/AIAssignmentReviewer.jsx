import { useState } from "react";
import AIAssignmentService from "../../services/AIAssignmentService";

function AIAssignmentReviewer() {

    const [formData, setFormData] = useState({
        course: "",
        assignmentTitle: "",
        instructions: "",
        studentAnswer: ""
    });

    const [review, setReview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

    };

    const reviewAssignment = async (e) => {

        e.preventDefault();

        setLoading(true);
        setError("");
        setReview(null);

        try {

            const response =
                await AIAssignmentService.reviewAssignment(formData);

            setReview(response.data);

        } catch (error) {

            console.error(error);

            setError("Failed to review assignment.");

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container mt-4">

            <div className="card shadow">

                <div className="card-header bg-primary text-white">

                    <h3>
                        🤖 AI Assignment Reviewer
                    </h3>

                </div>

                <div className="card-body">

                    <form onSubmit={reviewAssignment}>

                        <div className="mb-3">

                            <label className="form-label">
                                Course
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Assignment Title
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                name="assignmentTitle"
                                value={formData.assignmentTitle}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Instructions
                            </label>

                            <textarea
                                rows="4"
                                className="form-control"
                                name="instructions"
                                value={formData.instructions}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">
                                Student Answer
                            </label>

                            <textarea
                                rows="8"
                                className="form-control"
                                name="studentAnswer"
                                value={formData.studentAnswer}
                                onChange={handleChange}
                                required
                            />

                        </div>

                        <button
                            className="btn btn-success"
                            disabled={loading}
                        >
                            {loading ? "Reviewing..." : "Review with AI"}
                        </button>

                    </form>

                    {error && (

                        <div className="alert alert-danger mt-4">

                            {error}

                        </div>

                    )}

                    {review && (

                        <div className="mt-4">

                            <div className="card mb-3">

                                <div className="card-header bg-success text-white">
                                    AI Review
                                </div>

                                <div className="card-body">

                                    <h5>
                                        Score
                                    </h5>

                                    <p>{review.score}</p>

                                    <h5>
                                        Feedback
                                    </h5>

                                    <p>{review.feedback}</p>

                                    <h5>
                                        Strengths
                                    </h5>

                                    <p>{review.strengths}</p>

                                    <h5>
                                        Weaknesses
                                    </h5>

                                    <p>{review.weaknesses}</p>

                                    <h5>
                                        Suggestions
                                    </h5>

                                    <p>{review.suggestions}</p>

                                </div>

                            </div>

                        </div>

                    )}

                </div>

            </div>

        </div>

    );

}

export default AIAssignmentReviewer;