import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import SubjectService from "../../services/SubjectService";
import TopicService from "../../services/TopicService";

function ViewSubject() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [subject, setSubject] = useState(null);
    const [topics, setTopics] = useState([]);

    const [loading, setLoading] = useState(true);
    const [topicsLoading, setTopicsLoading] = useState(true);

    useEffect(() => {
        loadSubject();
    }, [id]);

    const loadSubject = async () => {

        try {

            setLoading(true);

            const response =
                await SubjectService.getSubjectById(id);

            setSubject(response.data);

        } catch (error) {

            console.error(
                "Unable to load subject:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Unable to load subject."
            );

        } finally {

            setLoading(false);
        }

        loadTopics();
    };

    const loadTopics = async () => {

        try {

            setTopicsLoading(true);

            const response =
                await TopicService.getTopicsBySubject(id);

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

            console.error(
                "Backend response:",
                error.response?.data
            );

            setTopics([]);

        } finally {

            setTopicsLoading(false);
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
                        Loading subject...
                    </p>

                </div>

            </DashboardLayout>
        );
    }

    if (!subject) {

        return (
            <DashboardLayout>

                <div className="container mt-5">

                    <div className="alert alert-warning">
                        Subject not found.
                    </div>

                    <button
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/subjects")
                        }
                    >
                        Back to Subjects
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
                        Subject Details
                    </h2>

                    <button
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/subjects")
                        }
                    >
                        Back
                    </button>

                </div>


                {/* SUBJECT INFORMATION */}

                <div className="card shadow mb-4">

                    <div className="card-header">

                        <h3 className="mb-0">
                            {subject.name}
                        </h3>

                    </div>

                    <div className="card-body">

                        <p>
                            <strong>
                                Subject ID:
                            </strong>{" "}
                            {subject.id}
                        </p>

                        <p>
                            <strong>
                                Subject:
                            </strong>{" "}
                            {subject.name}
                        </p>

                        <p>
                            <strong>
                                Course:
                            </strong>{" "}

                            {subject.courseTitle ||
                                subject.course?.title ||
                                subject.course?.name ||
                                "Not available"}

                        </p>

                    </div>

                </div>


                {/* TOPICS */}

                <div className="card shadow">

                    <div className="card-header">

                        <h4 className="mb-0">
                            Topics
                        </h4>

                    </div>

                    <div className="card-body">

                        {topicsLoading ? (

                            <div className="text-center">

                                <div
                                    className="spinner-border"
                                    role="status"
                                />

                                <p className="mt-2">
                                    Loading topics...
                                </p>

                            </div>

                        ) : topics.length === 0 ? (

                            <div className="alert alert-info">
                                No topics available
                                for this subject.
                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-bordered">

                                    <thead>

                                        <tr>

                                            <th>
                                                #
                                            </th>

                                            <th>
                                                Topic
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {topics.map(
                                            (topic, index) => (

                                                <tr
                                                    key={
                                                        topic.id
                                                    }
                                                >

                                                    <td>
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        {
                                                            topic.title
                                                        }
                                                    </td>

                                                    <td>

                                                        <Link
                                                            to={`/topics/${topic.id}`}
                                                            className="
                                                                btn
                                                                btn-primary
                                                                btn-sm
                                                            "
                                                        >
                                                            View Topic
                                                        </Link>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default ViewSubject;