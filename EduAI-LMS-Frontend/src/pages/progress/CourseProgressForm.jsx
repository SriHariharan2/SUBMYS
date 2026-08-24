import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import CourseProgressService from "../../services/CourseProgressService";

function CourseProgressForm() {

    const navigate = useNavigate();

    const { studentId, courseId } = useParams();

    const isEdit = studentId && courseId;

    const [formData, setFormData] = useState({
        studentId: "",
        courseId: "",
        completedTopics: 0,
    });

    useEffect(() => {

        if (isEdit) {

            CourseProgressService.getProgress(studentId, courseId)
                .then((response) => {

                    setFormData({
                        studentId: response.data.student.id,
                        courseId: response.data.course.id,
                        completedTopics: response.data.completedTopics,
                    });

                })
                .catch((error) => console.error(error));

        }

    }, [studentId, courseId, isEdit]);

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value,

        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (isEdit) {

            CourseProgressService.updateProgress(
                formData.studentId,
                formData.courseId,
                formData.completedTopics
            )
                .then(() => navigate("/course-progress"))
                .catch((error) => console.error(error));

        } else {

            CourseProgressService.createProgress(
                formData.studentId,
                formData.courseId
            )
                .then(() => navigate("/course-progress"))
                .catch((error) => console.error(error));

        }

    };

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h3>

                            {isEdit
                                ? "Update Course Progress"
                                : "Create Course Progress"}

                        </h3>

                    </div>

                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label className="form-label">

                                    Student ID

                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="studentId"
                                    value={formData.studentId}
                                    onChange={handleChange}
                                    required
                                    disabled={isEdit}
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Course ID

                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="courseId"
                                    value={formData.courseId}
                                    onChange={handleChange}
                                    required
                                    disabled={isEdit}
                                />

                            </div>

                            {isEdit && (

                                <div className="mb-3">

                                    <label className="form-label">

                                        Completed Topics

                                    </label>

                                    <input
                                        type="number"
                                        className="form-control"
                                        name="completedTopics"
                                        value={formData.completedTopics}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            )}

                            <button
                                type="submit"
                                className="btn btn-success"
                            >

                                {isEdit ? "Update" : "Create"}

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default CourseProgressForm;