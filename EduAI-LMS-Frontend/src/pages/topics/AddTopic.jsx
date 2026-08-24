import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import TopicService from "../../services/TopicService";
import SubjectService from "../../services/SubjectService";

function AddTopic() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [subjectId, setSubjectId] = useState("");

    const [subjects, setSubjects] = useState([]);

    useEffect(() => {

        loadSubjects();

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

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await TopicService.createTopic(

                subjectId,

                {
                    title,
                    content
                }

            );

            alert("Topic Added Successfully");

            navigate("/topics");

        } catch (error) {

            console.error(error);

            alert("Unable to create topic.");

        }

    };

    return (

        <DashboardLayout>

            <h2>Add Topic</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label className="form-label">

                        Subject

                    </label>

                    <select
                        className="form-select"
                        value={subjectId}
                        onChange={(e) => setSubjectId(e.target.value)}
                        required
                    >

                        <option value="">

                            Select Subject

                        </option>

                        {

                            subjects.map(subject => (

                                <option
                                    key={subject.id}
                                    value={subject.id}
                                >

                                    {subject.name}

                                </option>

                            ))

                        }

                    </select>

                </div>

                <div className="mb-3">

                    <label className="form-label">

                        Topic Title

                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
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
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />

                </div>

                <button
                    className="btn btn-primary"
                    type="submit"
                >

                    Save Topic

                </button>

            </form>

        </DashboardLayout>

    );

}

export default AddTopic;