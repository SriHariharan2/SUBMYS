import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import SubjectService from "../../services/SubjectService";
import CourseService from "../../services/CourseService";

function EditSubject() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [courseId, setCourseId] = useState("");
    const [courses, setCourses] = useState([]);

    useEffect(() => {

        loadCourses();
        loadSubject();

    }, []);

    const loadCourses = async () => {

        try {

            const response = await CourseService.getAllCourses();

            setCourses(response.data);

        } catch (error) {

            console.error(error);

        }

    };

    const loadSubject = async () => {

        try {

            const response = await SubjectService.getSubjectById(id);

            setName(response.data.name);

            if (response.data.course) {
                setCourseId(response.data.course.id);
            }

        } catch (error) {

            console.error(error);

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await SubjectService.updateSubject(id, courseId, {

                name

            });

            alert("Subject updated successfully.");

            navigate("/subjects");

        } catch (error) {

            console.error(error);

            alert("Update failed.");

        }

    };

    return (

        <DashboardLayout>

            <div className="card shadow">

                <div className="card-body">

                    <h2 className="mb-4">

                        Edit Subject

                    </h2>

                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">

                            <label className="form-label">

                                Subject Name

                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>

                        <div className="mb-3">

                            <label className="form-label">

                                Course

                            </label>

                            <select
                                className="form-select"
                                value={courseId}
                                onChange={(e) =>
                                    setCourseId(e.target.value)
                                }
                                required
                            >

                                <option value="">

                                    Select Course

                                </option>

                                {courses.map((course) => (

                                    <option
                                        key={course.id}
                                        value={course.id}
                                    >

                                        {course.title}

                                    </option>

                                ))}

                            </select>

                        </div>

                        <button
                            className="btn btn-primary"
                            type="submit"
                        >

                            Update Subject

                        </button>

                    </form>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default EditSubject;