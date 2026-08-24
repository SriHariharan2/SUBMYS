import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import TopicService from "../../services/TopicService";
import LearningResourceService from "../../services/LearningResourceService";

function AddResource() {

    const navigate = useNavigate();

    const [topics, setTopics] = useState([]);

    const [topicId, setTopicId] = useState("");

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [resourceType, setResourceType] = useState("PDF");

    const [file, setFile] = useState(null);

    const [resourceUrl, setResourceUrl] = useState("");

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

            // ================= FILE TYPES =================

            if (resourceType === "PDF" || resourceType === "PPT") {

                if (!file) {

                    alert("Please choose a file.");

                    return;

                }

                const formData = new FormData();

                formData.append("title", title);
                formData.append("description", description);
                formData.append("resourceType", resourceType);
                formData.append("file", file);

                await LearningResourceService.uploadResource(
                    topicId,
                    formData
                );

            }

            // ================= URL TYPES =================

            else {

                await LearningResourceService.createResource(
                    topicId,
                    {
                        title,
                        description,
                        resourceType,
                        resourceUrl
                    }
                );

            }

            alert("Learning Resource Added Successfully.");

            navigate("/resources");

        } catch (error) {

            console.error(error);

            alert("Unable to save resource.");

        }

    };

    return (

        <DashboardLayout>

            <div className="container">

                <h2 className="mb-4">

                    Add Learning Resource

                </h2>

                <form onSubmit={handleSubmit}>

                    {/* Topic */}

                    <div className="mb-3">

                        <label className="form-label">

                            Topic

                        </label>

                        <select
                            className="form-select"
                            value={topicId}
                            onChange={(e) =>
                                setTopicId(e.target.value)
                            }
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

                    {/* Title */}

                    <div className="mb-3">

                        <label className="form-label">

                            Title

                        </label>

                        <input
                            className="form-control"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                            required
                        />

                    </div>

                    {/* Description */}

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

                    {/* Resource Type */}

                    <div className="mb-3">

                        <label className="form-label">

                            Resource Type

                        </label>

                        <select
                            className="form-select"
                            value={resourceType}
                            onChange={(e) =>
                                setResourceType(e.target.value)
                            }
                        >

                            <option value="PDF">

                                PDF

                            </option>

                            <option value="PPT">

                                PPT

                            </option>

                            <option value="VIDEO">

                                VIDEO

                            </option>

                            <option value="LINK">

                                LINK

                            </option>

                        </select>

                    </div>

                    {/* PDF & PPT */}

                    {

                        (resourceType === "PDF" ||
                            resourceType === "PPT") &&

                        <div className="mb-3">

                            <label className="form-label">

                                Choose File

                            </label>

                            <input
                                type="file"
                                className="form-control"
                                accept={
                                    resourceType === "PDF"
                                        ? ".pdf"
                                        : ".ppt,.pptx"
                                }
                                onChange={(e) =>
                                    setFile(e.target.files[0])
                                }
                                required
                            />

                        </div>

                    }

                    {/* VIDEO & LINK */}

                    {

                        (resourceType === "VIDEO" ||
                            resourceType === "LINK") &&

                        <div className="mb-3">

                            <label className="form-label">

                                Resource URL

                            </label>

                            <input
                                type="url"
                                className="form-control"
                                placeholder={
                                    resourceType === "VIDEO"
                                        ? "https://youtube.com/..."
                                        : "https://example.com"
                                }
                                value={resourceUrl}
                                onChange={(e) =>
                                    setResourceUrl(e.target.value)
                                }
                                required
                            />

                        </div>

                    }

                    <button
                        type="submit"
                        className="btn btn-primary"
                    >

                        Save Resource

                    </button>

                </form>

            </div>

        </DashboardLayout>

    );

}

export default AddResource;