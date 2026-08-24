import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import QuizService from "../../services/QuizService";
import TopicService from "../../services/TopicService";

function AddQuiz() {

    const navigate = useNavigate();

    const [topics, setTopics] = useState([]);

    const [topicId, setTopicId] = useState("");

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [totalMarks, setTotalMarks] = useState("");

    const [durationMinutes, setDurationMinutes] = useState("");

    const [maxAttempts, setMaxAttempts] = useState("1");

    // =====================================================
    // LOAD TOPICS
    // =====================================================

    useEffect(() => {

        loadTopics();

    }, []);

    const loadTopics = async () => {

        try {

            const response =
                await TopicService.getAllTopics();

            setTopics(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Unable to load topics:",
                error
            );

            alert("Unable to load topics.");
        }
    };

    // =====================================================
    // CREATE QUIZ
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
                "Creating Quiz:",
                quizData
            );

            await QuizService.createQuiz(
                topicId,
                quizData
            );

            alert(
                "Quiz created successfully."
            );

            navigate("/quizzes");

        } catch (error) {

            console.error(
                "Quiz creation failed:",
                error
            );

            alert(
                error?.response?.data?.message ||
                "Quiz creation failed."
            );
        }
    };

    return (

        <DashboardLayout>

            <div className="container">

                <h2 className="mb-4">
                    Add Quiz
                </h2>

                <form
                    onSubmit={handleSubmit}
                >

                    {/* ================= TOPIC ================= */}

                    <div className="mb-3">

                        <label className="form-label">
                            Topic
                        </label>

                        <select
                            className="form-select"
                            value={topicId}
                            onChange={(e) =>
                                setTopicId(
                                    e.target.value
                                )
                            }
                            required
                        >

                            <option value="">
                                Select Topic
                            </option>

                            {topics.map(
                                (topic) => (

                                    <option
                                        key={topic.id}
                                        value={topic.id}
                                    >
                                        {topic.title}
                                    </option>

                                )
                            )}

                        </select>

                    </div>

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

                    {/* ================= SUBMIT ================= */}

                    <button
                        type="submit"
                        className="btn btn-success"
                    >
                        Create Quiz
                    </button>

                </form>

            </div>

        </DashboardLayout>
    );
}

export default AddQuiz;