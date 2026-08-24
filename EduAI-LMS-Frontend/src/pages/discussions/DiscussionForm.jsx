import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import DiscussionService from "../../services/DiscussionService";
import CourseService from "../../services/CourseService";
import UserService from "../../services/UserService";

function DiscussionForm() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);

    const [users, setUsers] = useState([]);

    const [courseId, setCourseId] = useState("");

    const [userId, setUserId] = useState("");

    const [title, setTitle] = useState("");

    const [content, setContent] = useState("");

    useEffect(() => {

        loadCourses();

        loadUsers();

        if (id) {

            loadDiscussion();

        }

    }, []);

    const loadCourses = async () => {

        try {

            const response = await CourseService.getAllCourses();

            setCourses(response.data);

        }

        catch (error) {

            console.error(error);

        }

    };

    const loadUsers = async () => {

        try {

            const response = await UserService.getAllUsers();

            setUsers(response.data);

        }

        catch (error) {

            console.error(error);

        }

    };

    const loadDiscussion = async () => {

        try {

            const response = await DiscussionService.getById(id);

            const discussion = response.data;

            setTitle(discussion.title);

            setContent(discussion.content);

            if (discussion.course) {

                setCourseId(discussion.course.id);

            }

            if (discussion.user) {

                setUserId(discussion.user.id);

            }

        }

        catch (error) {

            console.error(error);

        }

    };

    const saveDiscussion = async (e) => {

        e.preventDefault();

        const discussion = {

            title,

            content

        };

        try {

            if (id) {

                await DiscussionService.update(

                    id,

                    discussion

                );

            }

            else {

                await DiscussionService.create(

                    courseId,

                    userId,

                    discussion

                );

            }

            alert("Discussion saved successfully.");

            navigate("/discussions");

        }

        catch (error) {

            console.error(error);

            alert("Unable to save discussion.");

        }

    };
        return (

        <DashboardLayout>

            <div className="container">

                <div className="card shadow">

                    <div className="card-header bg-primary text-white">

                        <h3>

                            {id ? "Edit Discussion" : "Add Discussion"}

                        </h3>

                    </div>

                    <div className="card-body">

                        <form onSubmit={saveDiscussion}>

                            {

                                !id && (

                                    <>

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

                                                {

                                                    courses.map(course => (

                                                        <option
                                                            key={course.id}
                                                            value={course.id}
                                                        >

                                                            {course.title}

                                                        </option>

                                                    ))

                                                }

                                            </select>

                                        </div>

                                        <div className="mb-3">

                                            <label className="form-label">

                                                User

                                            </label>

                                            <select
                                                className="form-select"
                                                value={userId}
                                                onChange={(e) =>
                                                    setUserId(e.target.value)
                                                }
                                                required
                                            >

                                                <option value="">

                                                    Select User

                                                </option>

                                                {

                                                    users.map(user => (

                                                        <option
                                                            key={user.id}
                                                            value={user.id}
                                                        >

                                                            {user.fullName}

                                                        </option>

                                                    ))

                                                }

                                            </select>

                                        </div>

                                    </>

                                )

                            }

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

                                    Content

                                </label>

                                <textarea
                                    rows="6"
                                    className="form-control"
                                    value={content}
                                    onChange={(e) =>
                                        setContent(e.target.value)
                                    }
                                    required
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-success me-2"
                            >

                                Save

                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    navigate("/discussions")
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

export default DiscussionForm;