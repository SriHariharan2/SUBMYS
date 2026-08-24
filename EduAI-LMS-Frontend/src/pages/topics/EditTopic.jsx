import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import TopicService from "../../services/TopicService";
import SubjectService from "../../services/SubjectService";

function EditTopic() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [subjects, setSubjects] = useState([]);

    const [subjectId, setSubjectId] = useState("");

    const [title, setTitle] = useState("");

    const [content, setContent] = useState("");

    useEffect(() => {
        loadSubjects();
        loadTopic();
    }, []);

    const loadSubjects = async () => {

        try {

            const response = await SubjectService.getAllSubjects();

            setSubjects(response.data);

        } catch (error) {

            console.error(error);

            alert("Unable to load subjects.");

        }

    };

    const loadTopic = async () => {

        try {

            const response = await TopicService.getTopicById(id);

            const topic = response.data;

            setTitle(topic.title);

            setContent(topic.content);

            if (topic.subject) {
                setSubjectId(topic.subject.id);
            }

        } catch (error) {

            console.error(error);

            alert("Unable to load topic.");

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const topic = {

                title,

                content

            };

            await TopicService.updateTopic(id, topic);

            alert("Topic updated successfully.");

            navigate("/topics");

        } catch (error) {

            console.error(error);

            alert("Topic update failed.");

        }

    };

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card">

                    <div className="card-header">

                        <h3>Edit Topic</h3>

                    </div>

                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label className="form-label">

                                    Subject

                                </label>

                                <select
                                    className="form-select"
                                    value={subjectId}
                                    disabled
                                >

                                    <option value="">

                                        Select Subject

                                    </option>

                                    {subjects.map(subject => (

                                        <option
                                            key={subject.id}
                                            value={subject.id}
                                        >

                                            {subject.name}

                                        </option>

                                    ))}

                                </select>

                                <small className="text-muted">

                                    Subject cannot be changed after topic creation.

                                </small>

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Topic Title

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) =>
                                        setTitle(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Content

                                </label>

                                <textarea
                                    rows="8"
                                    className="form-control"
                                    value={content}
                                    onChange={(e) =>
                                        setContent(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary"
                            >

                                Update Topic

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default EditTopic;