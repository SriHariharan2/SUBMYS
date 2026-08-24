import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import CourseService from "../../services/CourseService";

function EditCourse() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    useEffect(() => {

        loadCourse();

    }, []);

    const loadCourse = async () => {

        try {

            const response = await CourseService.getCourseById(id);

            setTitle(response.data.title);

            setDescription(response.data.description);

        } catch (error) {

            console.error(error);

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await CourseService.updateCourse(id, {

                title,
                description,

            });

            alert("Course updated successfully.");

            navigate("/courses");

        } catch (error) {

            console.error(error);

            alert("Update failed.");

        }

    };

    return (

        <DashboardLayout>

            <h2>Edit Course</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label className="form-label">

                        Title

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

                        Description

                    </label>

                    <textarea
                        className="form-control"
                        rows="4"
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        required
                    />

                </div>

                <button
                    className="btn btn-primary"
                    type="submit"
                >
                    Update
                </button>

            </form>

        </DashboardLayout>

    );

}

export default EditCourse;