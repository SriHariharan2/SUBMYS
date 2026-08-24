import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NotificationService from "../../services/NotificationService";

function NotificationForm() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {

        if (id) {

            loadNotification();

        }

    }, [id]);

    const loadNotification = async () => {

        try {

            const response = await NotificationService.getById(id);

            setMessage(response.data.message);

        } catch (error) {

            console.error(error);

        }

    };

    const saveNotification = async (e) => {

        e.preventDefault();

        const notification = {
            message
        };

        try {

            if (id) {

                await NotificationService.update(id, notification);

            } else {

                await NotificationService.create(
                    userId,
                    notification
                );

            }

            navigate("/notifications");

        } catch (error) {

            console.error(error);

        }

    };

    return (

        <div className="container mt-4">

            <div className="card shadow">

                <div className="card-header bg-primary text-white">

                    <h3>

                        {id ? "Edit Notification" : "Create Notification"}

                    </h3>

                </div>

                <div className="card-body">

                    <form onSubmit={saveNotification}>

                        {!id && (

                            <div className="mb-3">

                                <label className="form-label">

                                    User ID

                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    value={userId}
                                    onChange={(e) =>
                                        setUserId(e.target.value)
                                    }
                                    required
                                />

                            </div>

                        )}

                        <div className="mb-3">

                            <label className="form-label">

                                Message

                            </label>

                            <textarea
                                rows="5"
                                className="form-control"
                                value={message}
                                onChange={(e) =>
                                    setMessage(e.target.value)
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
                            onClick={() => navigate("/notifications")}
                        >
                            Cancel
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );

}

export default NotificationForm;