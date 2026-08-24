import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import TopicService from "../../services/TopicService";

function ViewTopic() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [topic, setTopic] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTopic();
    }, [id]);

    const loadTopic = async () => {

        try {

            setLoading(true);

            const response =
                await TopicService.getTopicById(id);

            setTopic(response.data);

        } catch (error) {

            console.error(
                "Unable to load topic:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Unable to load topic."
            );

        } finally {

            setLoading(false);
        }
    };

    if (loading) {

        return (
            <DashboardLayout>

                <div className="container mt-5 text-center">

                    <div
                        className="spinner-border"
                        role="status"
                    />

                    <p className="mt-3">
                        Loading topic...
                    </p>

                </div>

            </DashboardLayout>
        );
    }

    if (!topic) {

        return (
            <DashboardLayout>

                <div className="container mt-5">

                    <div className="alert alert-warning">
                        Topic not found.
                    </div>

                    <button
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/topics")
                        }
                    >
                        Back to Topics
                    </button>

                </div>

            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            <div className="container mt-4">

                {/* HEADER */}

                <div
                    className="
                        d-flex
                        justify-content-between
                        align-items-center
                        mb-4
                    "
                >

                    <h2>
                        Topic Details
                    </h2>

                    <button
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/topics")
                        }
                    >
                        Back
                    </button>

                </div>


                {/* TOPIC INFORMATION */}

                <div className="card shadow mb-4">

                    <div className="card-header">

                        <h3 className="mb-0">
                            {topic.title}
                        </h3>

                    </div>

                    <div className="card-body">

                        <p>
                            <strong>
                                Topic ID:
                            </strong>{" "}
                            {topic.id}
                        </p>

                        <p>
                            <strong>
                                Topic:
                            </strong>{" "}
                            {topic.title}
                        </p>

                        <p>
                            <strong>
                                Subject:
                            </strong>{" "}

                            {topic.subjectName ||
                                topic.subject?.name ||
                                "Not available"}

                        </p>

                        <p>
                            <strong>
                                Course:
                            </strong>{" "}

                            {topic.courseTitle ||
                                topic.subject?.course?.title ||
                                topic.subject?.course?.name ||
                                "Not available"}

                        </p>

                    </div>

                </div>


                {/* TOPIC CONTENT */}

                <div className="card shadow">

                    <div className="card-header">

                        <h4 className="mb-0">
                            Topic Content
                        </h4>

                    </div>

                    <div className="card-body">

                        {topic.content ? (

                            <div
                                className="border rounded p-3"
                                style={{
                                    whiteSpace: "pre-wrap"
                                }}
                            >
                                {topic.content}
                            </div>

                        ) : (

                            <div className="alert alert-info">
                                No content available
                                for this topic.
                            </div>

                        )}

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default ViewTopic;