import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import ReplyService from "../../services/ReplyService";
import UserService from "../../services/UserService";

function ReplyForm() {

    const { id, discussionId } = useParams();

    const navigate = useNavigate();

    const [users, setUsers] = useState([]);

    const [userId, setUserId] = useState("");

    const [content, setContent] = useState("");

    useEffect(() => {

        loadUsers();

        if (id) {

            loadReply();

        }

    }, []);

    const loadUsers = async () => {

        try {

            const response = await UserService.getAllUsers();

            setUsers(response.data);

        }

        catch (error) {

            console.error(error);

        }

    };

    const loadReply = async () => {

        try {

            const response = await ReplyService.getById(id);

            const reply = response.data;

            setContent(reply.message);

            if (reply.user) {

                setUserId(reply.user.id);

            }

        }

        catch (error) {

            console.error(error);

        }

    };

    const saveReply = async (e) => {

        e.preventDefault();

        const reply = {

            message: content

        };

        try {

            if (id) {

                await ReplyService.update(id, reply);

            }

            else {

                await ReplyService.create(

                    discussionId,

                    userId,

                    reply

                );

            }

            alert("Reply saved successfully.");

            navigate(`/discussions/${discussionId}/replies`);

        }

        catch (error) {

            console.error(error);

            alert("Unable to save reply.");

        }

    };
        return (

        <DashboardLayout>

            <div className="container">

                <div className="card shadow">

                    <div className="card-header bg-primary text-white">

                        <h3>

                            {id ? "Edit Reply" : "Add Reply"}

                        </h3>

                    </div>

                    <div className="card-body">

                        <form onSubmit={saveReply}>

                            {

                                !id && (

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

                                )

                            }

                            <div className="mb-3">

                                <label className="form-label">

                                    Reply

                                </label>

                                <textarea
                                    rows="5"
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
                                    navigate(`/discussions/${discussionId}/replies`)
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

export default ReplyForm;