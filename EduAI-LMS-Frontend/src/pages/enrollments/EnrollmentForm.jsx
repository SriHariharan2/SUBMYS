import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import EnrollmentService from "../../services/EnrollmentService";
import UserService from "../../services/UserService";
import CourseService from "../../services/CourseService";

function EnrollmentForm() {

    const navigate = useNavigate();

    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);

    const [studentId, setStudentId] = useState("");
    const [courseId, setCourseId] = useState("");

    useEffect(() => {

        loadStudents();
        loadCourses();

    }, []);

    const loadStudents = () => {

        UserService.getAllUsers()
            .then((response) => {

                const studentUsers = response.data.filter(
                    (user) => user.role === "STUDENT"
                );

                setStudents(studentUsers);

            })
            .catch((error) => console.error(error));

    };

    const loadCourses = () => {

        CourseService.getAllCourses()
            .then((response) => {

                setCourses(response.data);

            })
            .catch((error) => console.error(error));

    };

    const saveEnrollment = (e) => {

        e.preventDefault();

        if (!studentId || !courseId) {

            alert("Please select both a student and a course.");

            return;

        }

        EnrollmentService.enrollStudent(studentId, courseId)
            .then(() => {

                alert("Student enrolled successfully.");

                navigate("/enrollments");

            })
            .catch((error) => {

                console.error(error);

                if (error.response?.data?.message) {

                    alert(error.response.data.message);

                } else {

                    alert("Unable to enroll student.");

                }

            });

    };

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h3>Enroll Student</h3>

                    </div>

                    <div className="card-body">

                        <form onSubmit={saveEnrollment}>

                            <div className="mb-3">

                                <label className="form-label">

                                    Student

                                </label>

                                <select
                                    className="form-select"
                                    value={studentId}
                                    onChange={(e) =>
                                        setStudentId(e.target.value)
                                    }
                                    required
                                >

                                    <option value="">

                                        Select Student

                                    </option>

                                    {students.map((student) => (

                                        <option
                                            key={student.id}
                                            value={student.id}
                                        >

                                            {student.fullName} ({student.email})

                                        </option>

                                    ))}

                                </select>

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
                                type="submit"
                                className="btn btn-success me-2"
                            >

                                Enroll Student

                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    navigate("/enrollments")
                                }
                            >

                                Cancel

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default EnrollmentForm;