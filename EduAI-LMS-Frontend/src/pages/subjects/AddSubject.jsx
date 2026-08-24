import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import SubjectService from "../../services/SubjectService";
import CourseService from "../../services/CourseService";

function AddSubject() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [courseId, setCourseId] = useState("");
    const [courses, setCourses] = useState([]);

    useEffect(() => {

        loadCourses();

    }, []);

    const loadCourses = async () => {

        try {

            const response = await CourseService.getAllCourses();

            setCourses(response.data);

        } catch (error) {

            console.error(error);

            alert("Unable to load courses.");

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!courseId) {

            alert("Please select a course.");

            return;

        }

        try {

            await SubjectService.createSubject(

                courseId,

                {
                    name,
                }

            );

            alert("Subject added successfully.");

            navigate("/subjects");

        } catch (error) {

            console.error(error);

            alert("Unable to add subject.");

        }

    };

    return (

        <DashboardLayout>

            <h2>Add Subject</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">

                    <label className="form-label">

                        Course

                    </label>

                    <select
                        className="form-select"
                        value={courseId}
                        onChange={(e) => setCourseId(e.target.value)}
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

                                {course.title || course.name}

                            </option>

                        ))}

                    </select>

                </div>

                <div className="mb-3">

                    <label className="form-label">

                        Subject Name

                    </label>

                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                >

                    Save

                </button>

            </form>

        </DashboardLayout>

    );

}

export default AddSubject;