import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AnnouncementService from "../../services/AnnouncementService";
import CourseService from "../../services/CourseService";


function AnnouncementForm() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [courses, setCourses] = useState([]);

    const [courseId, setCourseId] = useState("");

    const [title, setTitle] = useState("");

    const [message, setMessage] = useState("");

    const [loading, setLoading] = useState(false);


    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {

        loadCourses();

        if (id) {

            loadAnnouncement();
        }

    }, [id]);


    // =========================================================
    // LOAD COURSES
    // =========================================================

    const loadCourses = async () => {

        try {

            const response =
                await CourseService.getAllCourses();


            setCourses(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading courses:",
                error
            );

            alert(
                "Unable to load courses."
            );
        }
    };


    // =========================================================
    // LOAD ANNOUNCEMENT
    // =========================================================

    const loadAnnouncement = async () => {

        try {

            const response =
                await AnnouncementService.getById(id);


            const announcement =
                response.data;


            setTitle(
                announcement.title || ""
            );


            setMessage(
                announcement.message || ""
            );


            // IMPORTANT:
            // Backend now returns courseId directly
            if (announcement.courseId) {

                setCourseId(
                    String(announcement.courseId)
                );
            }

        } catch (error) {

            console.error(
                "Error loading announcement:",
                error
            );

            alert(
                "Unable to load announcement."
            );
        }
    };


    // =========================================================
    // SAVE
    // =========================================================

    const saveAnnouncement = async (e) => {

        e.preventDefault();


        if (!courseId) {

            alert(
                "Please select a course."
            );

            return;
        }


        if (!title.trim()) {

            alert(
                "Please enter announcement title."
            );

            return;
        }


        if (!message.trim()) {

            alert(
                "Please enter announcement message."
            );

            return;
        }


        setLoading(true);


        const announcement = {

            title: title.trim(),

            message: message.trim(),

            courseId: Number(courseId)
        };


        try {

            if (id) {

                await AnnouncementService.update(

                    id,

                    announcement
                );

            } else {

                await AnnouncementService.create(

                    courseId,

                    announcement
                );
            }


            alert(
                id
                    ? "Announcement updated successfully."
                    : "Announcement created successfully. Notifications sent to enrolled students."
            );


            navigate(
                "/announcements"
            );

        } catch (error) {

            console.error(
                "Error saving announcement:",
                error
            );


            if (
                error.response &&
                error.response.data
            ) {

                console.error(
                    "Backend error:",
                    error.response.data
                );
            }


            alert(
                "Unable to save announcement."
            );

        } finally {

            setLoading(false);
        }
    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="container mt-4">

            <div className="card shadow">

                <div className="card-body">

                    <h3 className="mb-4">

                        {id
                            ? "Edit Announcement"
                            : "Add Announcement"}

                    </h3>


                    <form
                        onSubmit={saveAnnouncement}
                    >

                        {/* COURSE */}

                        <div className="mb-3">

                            <label className="form-label">

                                Course

                            </label>


                            <select

                                className="form-select"

                                value={courseId}

                                onChange={(e) =>
                                    setCourseId(
                                        e.target.value
                                    )
                                }

                                required
                            >

                                <option value="">

                                    Select Course

                                </option>


                                {courses.map(
                                    (course) => (

                                        <option

                                            key={
                                                course.id
                                            }

                                            value={
                                                course.id
                                            }
                                        >

                                            {course.title}

                                        </option>
                                    )
                                )}

                            </select>

                        </div>


                        {/* TITLE */}

                        <div className="mb-3">

                            <label className="form-label">

                                Title

                            </label>


                            <input

                                type="text"

                                className="form-control"

                                placeholder="Enter announcement title"

                                value={title}

                                onChange={(e) =>
                                    setTitle(
                                        e.target.value
                                    )
                                }

                                required
                            />

                        </div>


                        {/* MESSAGE */}

                        <div className="mb-3">

                            <label className="form-label">

                                Message

                            </label>


                            <textarea

                                className="form-control"

                                rows="5"

                                placeholder="Enter announcement message"

                                value={message}

                                onChange={(e) =>
                                    setMessage(
                                        e.target.value
                                    )
                                }

                                required
                            />

                        </div>


                        {/* BUTTONS */}

                        <button

                            type="submit"

                            className="btn btn-success me-2"

                            disabled={loading}
                        >

                            {loading
                                ? "Saving..."
                                : "Save Announcement"}

                        </button>


                        <button

                            type="button"

                            className="btn btn-secondary"

                            onClick={() =>
                                navigate(
                                    "/announcements"
                                )
                            }

                            disabled={loading}
                        >

                            Cancel

                        </button>

                    </form>

                </div>

            </div>

        </div>
    );
}


export default AnnouncementForm;