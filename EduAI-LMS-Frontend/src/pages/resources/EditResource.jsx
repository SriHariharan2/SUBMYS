import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import LearningResourceService from "../../services/LearningResourceService";

function EditResource() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [resourceType, setResourceType] = useState("PDF");

    const [resourceUrl, setResourceUrl] = useState("");

    const [file, setFile] = useState(null);

    useEffect(() => {

        loadResource();

    }, []);

    const loadResource = async () => {

        try {

            const response =
                await LearningResourceService.getResourceById(id);

            const resource = response.data;

            setTitle(resource.title);
            setDescription(resource.description);
            setResourceType(resource.resourceType);
            setResourceUrl(resource.resourceUrl);

        }

        catch (error) {

            console.error(error);

            alert("Unable to load resource.");

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            // PDF / PPT
            if (resourceType === "PDF" || resourceType === "PPT") {

                if (file) {

                    const formData = new FormData();

                    formData.append("title", title);
                    formData.append("description", description);
                    formData.append("resourceType", resourceType);
                    formData.append("file", file);

                    await LearningResourceService.replaceFile(
                        id,
                        formData
                    );

                }

                else {

                    await LearningResourceService.updateResource(id, {

                        title,
                        description,
                        resourceType,
                        resourceUrl

                    });

                }

            }

            // VIDEO / LINK

            else {

                await LearningResourceService.updateResource(id, {

                    title,
                    description,
                    resourceType,
                    resourceUrl

                });

            }

            alert("Learning Resource Updated Successfully.");

            navigate("/resources");

        }

        catch (error) {

            console.error(error);

            alert("Update failed.");

        }

    };

    return (

        <DashboardLayout>

            <div className="container">

                <h2 className="mb-4">

                    Edit Learning Resource

                </h2>

                <form onSubmit={handleSubmit}>

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

                    {(resourceType === "PDF" ||
                        resourceType === "PPT") && (

                        <div className="mb-3">

                            <label className="form-label">

                                Replace File (Optional)

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
                            />

                        </div>

                    )}

                    {(resourceType === "VIDEO" ||
                        resourceType === "LINK") && (

                        <div className="mb-3">

                            <label className="form-label">

                                Resource URL

                            </label>

                            <input
                                type="url"
                                className="form-control"
                                value={resourceUrl}
                                onChange={(e) =>
                                    setResourceUrl(e.target.value)
                                }
                                required
                            />

                        </div>

                    )}

                    {resourceUrl && (

                        <div className="mb-3">

                            <a
                                href={resourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-info"
                            >

                                Open Current Resource

                            </a>

                        </div>

                    )}

                    <button
                        className="btn btn-primary"
                        type="submit"
                    >

                        Update Resource

                    </button>

                </form>

            </div>

        </DashboardLayout>

    );

}

export default EditResource;