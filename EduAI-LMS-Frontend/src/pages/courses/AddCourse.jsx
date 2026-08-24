import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import CourseService from "../../services/CourseService";

function AddCourse() {

    const navigate = useNavigate();

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await CourseService.createCourse({

                title,
                description,

            });

            alert("Course created successfully.");

            navigate("/courses");

        } catch (error) {

            console.error(error);

            alert("Unable to create course.");

        }

    };

    return (

        <DashboardLayout>

            <h2>Add Course</h2>

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
                    Save
                </button>

            </form>

        </DashboardLayout>

    );

}

export default AddCourse;