import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import QuizService from "../../services/QuizService";

function EditQuiz() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [title, setTitle] = useState("");

    const [description, setDescription] =
        useState("");

    const [totalMarks, setTotalMarks] =
        useState("");

    const [durationMinutes, setDurationMinutes] =
        useState("");

    const [maxAttempts, setMaxAttempts] =
        useState("1");

    const [loading, setLoading] =
        useState(true);

    // =====================================================
    // LOAD QUIZ
    // =====================================================

    useEffect(() => {

        loadQuiz();

    }, [id]);

    const loadQuiz = async () => {

        try {

            setLoading(true);

            const response =
                await QuizService.getQuizById(id);

            const quiz = response.data;

            console.log(
                "Quiz loaded:",
                quiz
            );

            setTitle(
                quiz.title || ""
            );

            setDescription(
                quiz.description || ""
            );

            setTotalMarks(
                quiz.totalMarks ?? ""
            );

            setDurationMinutes(
                quiz.durationMinutes ?? ""
            );

            setMaxAttempts(
                quiz.maxAttempts ?? 1
            );

        } catch (error) {

            console.error(
                "Unable to load quiz:",
                error
            );

            alert(
                "Unable to load quiz."
            );

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // UPDATE QUIZ
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const quizData = {

                title: title,

                description: description,

                totalMarks:
                    Number(totalMarks),

                durationMinutes:
                    Number(durationMinutes),

                maxAttempts:
                    Number(maxAttempts)
            };

            console.log(
                "Updating Quiz:",
                quizData
            );

            await QuizService.updateQuiz(
                id,
                quizData
            );

            alert(
                "Quiz updated successfully."
            );

            navigate("/quizzes");

        } catch (error) {

            console.error(
                "Quiz update failed:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Quiz update failed."
            );
        }
    };

    if (loading) {

        return (

            <DashboardLayout>

                <div className="container">

                    <h2>
                        Loading Quiz...
                    </h2>

                </div>

            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            <div className="container">

                <h2 className="mb-4">
                    Edit Quiz
                </h2>

                <form
                    onSubmit={handleSubmit}
                >

                    {/* ================= TITLE ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Quiz Title
                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) =>
                                setTitle(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>

                    {/* ================= DESCRIPTION ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Description
                        </label>

                        <textarea
                            rows="4"
                            className="form-control"
                            value={description}
                            onChange={(e) =>
                                setDescription(
                                    e.target.value
                                )
                            }
                        />

                    </div>

                    {/* ================= TOTAL MARKS ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Total Marks
                        </label>

                        <input
                            type="number"
                            min="1"
                            className="form-control"
                            value={totalMarks}
                            onChange={(e) =>
                                setTotalMarks(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>

                    {/* ================= DURATION ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Duration (Minutes)
                        </label>

                        <input
                            type="number"
                            min="1"
                            className="form-control"
                            value={durationMinutes}
                            onChange={(e) =>
                                setDurationMinutes(
                                    e.target.value
                                )
                            }
                            required
                        />

                    </div>

                    {/* ================= MAX ATTEMPTS ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Maximum Attempts
                        </label>

                        <input
                            type="number"
                            min="1"
                            className="form-control"
                            value={maxAttempts}
                            onChange={(e) =>
                                setMaxAttempts(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <small className="text-muted">
                            Example: 1 = one attempt,
                            2 = two attempts.
                        </small>

                    </div>

                    {/* ================= UPDATE ================= */}

                    <button
                        className="btn btn-primary"
                        type="submit"
                    >
                        Update Quiz
                    </button>

                </form>

            </div>

        </DashboardLayout>
    );
}

export default EditQuiz;