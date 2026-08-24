import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import CourseService from "../../services/CourseService";
import SubjectService from "../../services/SubjectService";

function ViewCourse() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [subjects, setSubjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [subjectsLoading, setSubjectsLoading] = useState(true);

    useEffect(() => {
        loadCourse();
    }, [id]);

    const loadCourse = async () => {

        try {

            setLoading(true);

            const response =
                await CourseService.getCourseById(id);

            setCourse(response.data);

        } catch (error) {

            console.error(
                "Unable to load course:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Unable to load course."
            );

        } finally {

            setLoading(false);
        }

        loadSubjects();
    };

    const loadSubjects = async () => {

        try {

            setSubjectsLoading(true);

            const response =
                await SubjectService.getSubjectsByCourse(id);

            setSubjects(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Unable to load subjects:",
                error
            );

            setSubjects([]);

        } finally {

            setSubjectsLoading(false);
        }
    };

    if (loading) {

        return (
            <DashboardLayout>

                <div className="container mt-5 text-center">

                    <div
                        className="spinner-border"
                        role="status"
                    />

                    <p className="mt-3">
                        Loading course...
                    </p>

                </div>

            </DashboardLayout>
        );
    }

    if (!course) {

        return (
            <DashboardLayout>

                <div className="container mt-5">

                    <div className="alert alert-warning">
                        Course not found.
                    </div>

                    <button
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/courses")
                        }
                    >
                        Back to Courses
                    </button>

                </div>

            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout>

            <div className="container mt-4">

                {/* HEADER */}

                <div
                    className="
                        d-flex
                        justify-content-between
                        align-items-center
                        mb-4
                    "
                >

                    <h2>
                        Course Details
                    </h2>

                    <button
                        className="btn btn-secondary"
                        onClick={() =>
                            navigate("/courses")
                        }
                    >
                        Back
                    </button>

                </div>


                {/* COURSE INFORMATION */}

                <div className="card shadow mb-4">

                    <div className="card-header">

                        <h3 className="mb-0">
                            {course.title}
                        </h3>

                    </div>

                    <div className="card-body">

                        <p>
                            <strong>
                                Course ID:
                            </strong>{" "}
                            {course.id}
                        </p>

                        <p>
                            <strong>
                                Course Code:
                            </strong>{" "}
                            {course.courseCode ||
                                course.code ||
                                "Not available"}
                        </p>

                        <p>
                            <strong>
                                Description:
                            </strong>
                        </p>

                        <div
                            className="
                                border
                                rounded
                                p-3
                                mb-3
                            "
                            style={{
                                whiteSpace: "pre-wrap"
                            }}
                        >

                            {course.description ||
                                "No description available."}

                        </div>

                        <p>
                            <strong>
                                Instructor:
                            </strong>{" "}

                            {course.instructor?.fullName ||
                                course.instructor?.name ||
                                course.instructorName ||
                                "Not assigned"}

                        </p>

                    </div>

                </div>


                {/* SUBJECTS */}

                <div className="card shadow">

                    <div className="card-header">

                        <h4 className="mb-0">
                            Subjects
                        </h4>

                    </div>

                    <div className="card-body">

                        {subjectsLoading ? (

                            <div className="text-center">

                                <div
                                    className="spinner-border"
                                    role="status"
                                />

                                <p className="mt-2">
                                    Loading subjects...
                                </p>

                            </div>

                        ) : subjects.length === 0 ? (

                            <div className="alert alert-info">
                                No subjects available
                                for this course.
                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-bordered">

                                    <thead>

                                        <tr>

                                            <th>
                                                #
                                            </th>

                                            <th>
                                                Subject
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {subjects.map(
                                            (subject, index) => (

                                                <tr
                                                    key={
                                                        subject.id
                                                    }
                                                >

                                                    <td>
                                                        {index + 1}
                                                    </td>

                                                    <td>
                                                        {
                                                            subject.name
                                                        }
                                                    </td>

                                                    <td>

                                                        <Link
                                                            to={`/subjects/${subject.id}`}
                                                            className="
                                                                btn
                                                                btn-primary
                                                                btn-sm
                                                            "
                                                        >
                                                            View Subject
                                                        </Link>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default ViewCourse;