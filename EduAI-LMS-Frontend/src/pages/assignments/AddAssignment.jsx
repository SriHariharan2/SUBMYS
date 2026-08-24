import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import AssignmentService from "../../services/AssignmentService";
import TopicService from "../../services/TopicService";

function AddAssignment() {

    const navigate = useNavigate();

    const [topics, setTopics] = useState([]);

    const [topicId, setTopicId] = useState("");

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [dueDate, setDueDate] = useState("");

    const [maxMarks, setMaxMarks] = useState("");

    useEffect(() => {

        loadTopics();

    }, []);

    const loadTopics = async () => {

        try {

            const response = await TopicService.getAllTopics();

            setTopics(response.data);

        } catch (error) {

            console.error(error);

            alert("Unable to load topics.");

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await AssignmentService.createAssignment(

                topicId,

                {

                    title,

                    description,

                    dueDate,

                    maxMarks

                }

            );

            alert("Assignment created successfully.");

            navigate("/assignments");

        }

        catch (error) {

            console.error(error);

            alert("Unable to create assignment.");

        }

    };

    return (

        <DashboardLayout>

            <div className="container">

                <h2 className="mb-4">

                    Add Assignment

                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label className="form-label">

                            Topic

                        </label>

                        <select
                            className="form-select"
                            value={topicId}
                            onChange={(e) => setTopicId(e.target.value)}
                            required
                        >

                            <option value="">

                                Select Topic

                            </option>

                            {

                                topics.map(topic => (

                                    <option
                                        key={topic.id}
                                        value={topic.id}
                                    >

                                        {topic.title}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div className="mb-3">

                        <label className="form-label">

                            Assignment Title

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

                            Description

                        </label>

                        <textarea
                            rows="5"
                            className="form-control"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">

                            Due Date

                        </label>

                        <input
                            type="date"
                            className="form-control"
                            value={dueDate}
                            onChange={(e) =>
                                setDueDate(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">

                            Maximum Marks

                        </label>

                        <input
                            type="number"
                            className="form-control"
                            value={maxMarks}
                            onChange={(e) =>
                                setMaxMarks(e.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        className="btn btn-primary"
                        type="submit"
                    >

                        Save Assignment

                    </button>

                </form>

            </div>

        </DashboardLayout>

    );

}

export default AddAssignment;